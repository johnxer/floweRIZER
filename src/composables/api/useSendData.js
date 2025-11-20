import { ref } from 'vue';

import { db } from '@/firebase/config';
import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore';

import { useAuthStore } from '@/stores/useAuthStore';

export const useSendData = () => {
    const authStore = useAuthStore();

    const uid = authStore.user?.uid;

    if (!uid) return false;

    const isPending = ref(false);
    const error = ref(null);

    const sendDataChats = async (chatId, data) => {
        if (!uid) return false;

        isPending.value = true;
        error.value = null;

        const chatPath = `users/${uid}/chats/${chatId}`;
        const chatReference = doc(db, chatPath);
        const messagesReference = collection(db, `${chatPath}/messages`);

        try {
            const response = await addDoc(messagesReference, {
                createdAt: serverTimestamp(),
                ...data,
            });

            await updateDoc(chatReference, {
                lastMessageAt: serverTimestamp(),
            });

            return true;
        } catch (err) {
            error.value = err.message;
            return false;
        } finally {
            isPending.value = false;
        }
    };

    const sendDataRooms = async (data) => {
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

            return response.id;
        } catch (err) {
            error.value = err.message;
            return false;
        } finally {
            isPending.value = false;
        }
    };

    const updateDataRooms = async (data, roomId) => {
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
        if (!uid) return false;

        isPending.value = true;
        error.value = null;

        const plantCollection = collection(db, `users/${uid}/rooms/${roomId}/plants`);

        if (data.wateredNow) {
            data.lastWateredDate = serverTimestamp();
        }

        delete data.wateredNow;

        try {
            const response = await addDoc(plantCollection, {
                ...data,
                userId: uid,
                createdAt: serverTimestamp(),
            });

            return response.id;
        } catch (err) {
            error.value = err.message;
            return false;
        } finally {
            isPending.value = false;
        }
    };

    const updateDataPlants = async (data, roomId, plantId) => {
        if (!uid) return false;

        isPending.value = true;
        error.value = null;

        const plantPath = `users/${uid}/rooms/${roomId}/plants/${plantId}`;
        const plantReference = doc(db, `${plantPath}`);

        delete data.wateredNow;

        try {
            await updateDoc(plantReference, {
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

    return {
        isPending,
        error,
        sendDataChats,
        sendDataRooms,
        sendDataPlants,
        updateDataRooms,
        updateDataPlants,
    };
};
