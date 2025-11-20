import { ref } from 'vue';

import { db } from '@/firebase/config';
import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore';

import { useAuthStore } from '@/stores/useAuthStore';

export const useSendData = () => {
    const authStore = useAuthStore();

    const uid = authStore.user?.uid;

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

    const sendDataPlants = async (data, roomId) => {
        if (!uid) return false;

        isPending.value = true;
        error.value = null;

        const plantCollection = collection(db, `users/${uid}/rooms/${roomId}/plants`);

        const payload = { ...data };

        if (payload.wateredNow) {
            payload.lastWateredDate = serverTimestamp();
        }

        delete payload.wateredNow;

        try {
            const response = await addDoc(plantCollection, {
                ...payload,
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

    return {
        isPending,
        error,
        sendDataChats,
        sendDataRooms,
        sendDataPlants,
    };
};
