import { onSnapshot } from 'firebase/firestore';
import { onUnmounted, ref, watchEffect } from 'vue';
import { useAuthStore } from '../../stores/useAuthStore';

export const useFirestoreSubscribe = (buildRefFn, isSingleDoc = false) => {
    const authStore = useAuthStore();

    const data = ref(isSingleDoc ? null : []);
    const error = ref(null);
    const isPending = ref(true);

    let unsubscribe = null;

    const start = (uid) => {
        error.value = null;
        isPending.value = true;

        if (!uid) {
            error.value = 'User not authenticated';
            isPending.value = false;
            return;
        }

        const refOrQuery = buildRefFn(uid);

        unsubscribe = onSnapshot(
            refOrQuery,
            (snapshot) => {
                if (isSingleDoc) {
                    if (snapshot.exists()) {
                        data.value = {
                            id: snapshot.id,
                            ...snapshot.data(),
                        };
                    } else {
                        data.value = null;
                    }
                } else {
                    data.value = snapshot.docs.map((doc) => {
                        return {
                            id: doc.id,
                            ...doc.data(),
                        };
                    });
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
        unsubscribe?.();

        if (!uid) {
            data.value = isSingleDoc ? null : [];
            isPending.value = false;
            return;
        }

        start(uid);
    });

    onUnmounted(() => unsubscribe?.())

    const reload = () => {
        const uid = authStore.user?.uid;

        if (uid) {
            unsubscribe?.();
            start(uid);
        }
    };

    return {
        data,
        error,
        isPending,
        reload,
    };
};
