import { doc, onSnapshot } from 'firebase/firestore';
import { onUnmounted, ref, watchEffect } from 'vue';
import { db } from '../firebase/config';
import { useAuth } from './useAuth';

export const useGetDetails = (dataType) => {
    const { getUid } = useAuth();
    const uid = getUid();


    const error = ref(null);
    const isPending = ref(true);
    const details = ref(null);

    let unsubscribe = null;
    
    
    const startListener = () => {

        if (!uid) return false;

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
        if (!uid) {
            unsubscribe?.();
            unsubscribe = null;
            details.value = null;
            isPending.value = false;
            return;
        }

        unsubscribe?.();
        startListener(uid);
    });

    onUnmounted(() => unsubscribe?.());

    const reloadData = () => {
        if (uid) {
            unsubscribe?.();
            startListener(uid);
        }
    };

    return {
        error,
        isPending,
        details,
        reloadData
    };
};
