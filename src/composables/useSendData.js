import { addDoc, collection, doc, serverTimestamp } from 'firebase/firestore';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { db } from '../firebase/config';
import { useAuthStore } from '../stores/useAuthStore';

export const useSendData = () => {
    const isPending = ref(false);
    const error = ref(null);

    const sendData = async (chatId, data) => {
        const { user } = storeToRefs(useAuthStore());

        if (!user.value) {
            error.value = 'User not authenticated';
            return false;
        }

        isPending.value = true;
        error.value = null;

        const chatPath = `users/${user.value.uid}/chats/${chatId}`;
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

            console.log(response.id);

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
        sendData,
    };
};
