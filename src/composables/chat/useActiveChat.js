import { addDoc, collection, doc, getDocs, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { ref } from 'vue';
import { db } from '../../firebase/config';
import { useAuthStore } from '../../stores/useAuthStore';

export const useActiveChat = () => {
    const authStore = useAuthStore();
    
    const activeChatId = ref(null);
    const isPending = ref(false);
    const error = ref(null);

    const getOrCreateChat = async () => {
        if (!authStore.user) return null;
        isPending.value = true;
        error.value = null;

        try {
            const chatsReference = collection(db, `users/${authStore.user?.uid}/chats`);

            const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

            const q = query(chatsReference, where('isActive', '==', true), where('lastMessageAt', '>', oneHourAgo));

            const snapshot = await getDocs(q);

            if (!snapshot.empty) {
                const existingChat = snapshot.docs[0];
                activeChatId.value = existingChat.id;
            } else {
                const newChat = await addDoc(chatsReference, {
                    createdAt: serverTimestamp(),
                    lastMessageAt: serverTimestamp(),
                    isActive: true,
                });
                activeChatId.value = newChat.id;
            }

            return activeChatId.value;
        } catch (err) {
            error.value = err.message;
            return null;
        } finally {
            isPending.value = false;
        }
    };

    const endChat = async () => {
        if (!authStore.user || !activeChatId.value) return;

        try {
            const chatReference = doc(db, `users/${authStore.user?.uid}/chats/${activeChatId.value}`);
            await updateDoc(chatReference, { isActive: false });
            activeChatId.value = null;
        } catch (err) {
            error.value = err.message;
        }
    };

    return {
        activeChatId,
        isPending,
        error,
        getOrCreateChat,
        endChat,
    };
};
