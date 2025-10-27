import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { storeToRefs } from 'pinia';
import { onUnmounted, ref, watch } from 'vue';
import { db } from '../firebase/config';
import { useAuthStore } from '../stores/useAuthStore';

export const useGetData = (chatIdRef) => {
    const { user } = storeToRefs(useAuthStore());

    const messages = ref([]);
    const error = ref(null);
    const isPending = ref(true);

    let unsubscribe = null;

    const attachListener = (uid, chatId) => {
        if (unsubscribe) unsubscribe();
        if (!uid || !chatId) return;

        const messagesPath = `users/${uid}/chats/${chatId}/messages`;

        console.log('Listening to chat:', messagesPath);

        const q = query(collection(db, messagesPath), orderBy('createdAt', 'asc'));

        unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                messages.value = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                isPending.value = false;
            },
            (err) => {
                error.value = err.message;
                isPending.value = false;
            }
        );
    };

    watch(
        [() => user.value?.uid, chatIdRef],
        ([uid, chatId]) => {
            if (!uid || !chatId) return;
            attachListener(uid, chatId);
        },
        { immediate: true }
    );

    onUnmounted(() => {
        if (unsubscribe) unsubscribe();
    });

    return { messages, error, isPending };
};
