import { addDoc, collection, doc, getDocs, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { db } from '../firebase/config';
import { useAuthStore } from '../stores/useAuthStore';

export const useActiveChat = () => {
    const { user } = storeToRefs(useAuthStore());
    const activeChatId = ref(null);
    const isPending = ref(false);
    const error = ref(null);

    const getOrCreateChat = async () => {
        if (!user.value) return null;
        isPending.value = true;

        const chatsReference = collection(db, `users/${user.value.uid}/chats`);

        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

        const q = query(chatsReference, where('isActive', '==', true), where('lastMessageAt', '>', oneHourAgo));

        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
            const existingChat = snapshot.docs[0];
            activeChatId.value = existingChat.id;
            // console.log('Found existing chat:', activeChatId.value);
        } else {
            const newChat = await addDoc(chatsReference, {
                createdAt: serverTimestamp(),
                lastMessageAt: serverTimestamp(),
                isActive: true,
            });
            activeChatId.value = newChat.id;
            // console.log('Created new chat:', activeChatId.value);
        }

        isPending.value = false;
        return activeChatId.value;
    };

    const endChat = async () => {
        if (!user.value || !activeChatId.value) return;

        try {
            const chatReference = doc(db, `users/${user.value.uid}/chats/${activeChatId.value}`);
            await updateDoc(chatReference, { isActive: false });
            // console.log('Chat ended successfully');
            activeChatId.value = null;
        } catch (err) {
            error.value = err.message;
            // console.error('Failed to end chat:', err.message);
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
