import { doc, onSnapshot } from 'firebase/firestore';
import { storeToRefs } from 'pinia';
import { onMounted, onUnmounted, ref } from 'vue';
import { db } from '../firebase/config';
import { useAuthStore } from '../stores/useAuthStore';

export const useGetDetails = (dataType) => {
    const { user } = storeToRefs(useAuthStore());
    
    const error = ref(null);
    const isPending = ref(true);
    const details = ref(null);

    const detailPath = `users/${user.value.uid}/${dataType}`;

    console.log('detailPath', detailPath)

    const docReference = doc(db, detailPath);

    let unsubscribe = null;

    const startListener = () => {
        if (!user.value?.uid) {
            error.value = 'User not authenticated';
            isPending.value = false;
            return;
        }

        unsubscribe = onSnapshot(
            docReference,
            (docSnap) => {
                if (docSnap.exists()) {
                    details.value = {
                        id: docSnap.id,
                        ...docSnap.data(),
                    };
                } else {
                    console.warn('Document not found');
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

    onMounted(() => startListener());

    onUnmounted(() => {
        if (unsubscribe) {
            unsubscribe();
        }
    });

    return {
        error,
        isPending,
        details,
    };
};
