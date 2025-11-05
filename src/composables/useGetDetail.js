import { doc, onSnapshot } from 'firebase/firestore';
import { onUnmounted, ref, watchEffect } from 'vue';
import { db } from '../firebase/config';
import { useAuthStore } from '../stores/useAuthStore';

export const useGetDetails = (dataType) => {
    const authStore = useAuthStore();

    const error = ref(null);
    const isPending = ref(true);
    const details = ref(null);

    let unsubscribe = null;

    const startListener = (uid) => {
        error.value = null;
        isPending.value = true

        if (!uid) {
            error.value = 'User not authenticated';
            isPending.value = false;
            return;
        }

        const detailPath = `users/${uid}/${dataType}`;
        const docReference = doc(db, detailPath);

        unsubscribe = onSnapshot(
            docReference,
            (snapshot) => {
                if (snapshot.exists()) {
                    details.value = {
                        id: snapshot.id,
                        ...snapshot.data(),
                    };
                } else {
                    details.value = null;
                }

                isPending.value = false;
            },
            (err) => {
                error.value = err.message;
                isPending.value = false;
            }
        );
    };

    watchEffect(() => {
        const uid = authStore.user?.uid;

        if (!uid) {
            if (unsubscribe) unsubscribe();
            unsubscribe = null;
            details.value = null;
            isPending.value = false;
            return;
        }

        if (unsubscribe) unsubscribe();
        startListener(uid);
    });

    onUnmounted(() => {
        if (unsubscribe) unsubscribe();
    });

    return {
        error,
        isPending,
        details,
    };
};
