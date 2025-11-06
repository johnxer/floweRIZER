import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { ref } from 'vue';
import { db } from '../firebase/config';
import { useAuthStore } from '../stores/useAuthStore';

export const useSendData = () => {
    const authStore = useAuthStore();

    const isPending = ref(false);
    const error = ref(null);

    const getUid = () => {
        const uid = authStore.user?.uid;

        if (!uid) {
            error.value = 'User not authenticated';
            return null;
        }

        return uid;
    };

    const sendDataChats = async (chatId, data) => {
        const uid = getUid();

        if (!uid) return false;

        isPending.value = true;
        error.value = null;

        const chatPath = `users/${uid}/chats/${chatId}`;
        const chatReference = doc(db, chatPath);
        const messagesReference = collection(db, `${chatPath}/messages`);

        console.log('Data odesílaná do Firestore:', data);

        try {
            const response = await addDoc(messagesReference, {
                createdAt: serverTimestamp(),
                ...data,
            });

            await updateDoc(chatReference, {
                lastMessageAt: serverTimestamp(),
            });

            console.log(response.id);

            return true;
        } catch (err) {
            error.value = err.message;
            return false;
        } finally {
            isPending.value = false;
        }
    };

    const sendDataRooms = async (data) => {
        const uid = getUid();

        if (!uid) return false;

        isPending.value = true;
        error.value = null;

        const roomPath = `users/${uid}/rooms`;
        const roomReference = collection(db, `${roomPath}`);

        try {
            const response = await addDoc(roomReference, {
                createdAt: serverTimestamp(),
                ...data,
            });

            console.log(response.id);

            return true;
        } catch (err) {
            error.value = err.message;
            return false;
        } finally {
            isPending.value = false;
        }
    };

    const updateDataRooms = async (data, roomId) => {
        const uid = getUid();

        if (!uid) return false;

        isPending.value = true;
        error.value = null;

        const roomPath = `users/${uid}/rooms/${roomId}`;
        const roomReference = doc(db, `${roomPath}`);

        try {
            await updateDoc(roomReference, {
                ...data,
            });

            return true;
        } catch (err) {
            error.value = err.message;
            return false;
        } finally {
            isPending.value = false;
        }
    };

    const sendDataPlants = async (data, roomId) => {
        const uid = getUid();

        if (!uid) return false;

        isPending.value = true;
        error.value = null;

        const plantCollection = collection(db, `users/${uid}/rooms/${roomId}/plants`);

        if (data.wateredNow) {
            data = {
                ...data,
                lastWateredDate: serverTimestamp(),
            };
        }

        try {
            await addDoc(plantCollection, {
                ...data,
                userId: uid,
                createdAt: serverTimestamp(),
            });

            return true;
        } catch (err) {
            error.value = err.message;
            return false;
        } finally {
            isPending.value = false;
        }
    };

    return {
        isPending,
        error,
        sendDataChats,
        sendDataRooms,
        sendDataPlants,
        updateDataRooms
    };
};
