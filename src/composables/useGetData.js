import { collection, collectionGroup, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { onUnmounted, ref, watchEffect } from 'vue';
import { db } from '../firebase/config';
import { useAuthStore } from '../stores/useAuthStore';

export const useGetData = (dataType) => {
    const authStore = useAuthStore();

    const error = ref(null);
    const isPending = ref(true);

    const items = ref([]);

    let unsubscribe = null;

    const startListener = (uid) => {
        error.value = null;
        isPending.value = true;

        if (!uid) {
            error.value = 'User not authenticated';
            isPending.value = false;
            return;
        }

        const itemPath = `users/${uid}/${dataType}`;
        const q = query(collection(db, itemPath), orderBy('createdAt', 'desc'));

        unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                items.value = snapshot.docs.map((doc) => {
                    return {
                        id: doc.id,
                        ...doc.data(),
                    };
                });
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
            unsubscribe?.();
            unsubscribe = null;
            items.value = [];
            isPending.value = false;
            return;
        }

        unsubscribe?.();
        startListener(uid);
    });

    onUnmounted(() => {
        unsubscribe?.();
    });

    return {
        error,
        isPending,
        items,
    };
};

export const useGetDataByUserId = (dataType) => {
    const authStore = useAuthStore();

    const error = ref(null);
    const isPending = ref(true);

    const items = ref([]);

    let unsubscribe = null;

    const startListener = (uid) => {
        error.value = null;
        isPending.value = true;

        if (!uid) {
            error.value = 'User not authenticated';
            isPending.value = false;
            return;
        }

        const q = query(collectionGroup(db, dataType), where('userId', '==', uid), orderBy('createdAt', 'desc'));

        unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                items.value = snapshot.docs.map((doc) => {
                    return {
                        id: doc.id,
                        ...doc.data(),
                    };
                });
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
            unsubscribe?.();
            unsubscribe = null;
            items.value = [];
            isPending.value = false;
            return;
        }

        unsubscribe?.();
        startListener(uid);
    });

    onUnmounted(() => unsubscribe?.());

    const reloadData = () => {
        const uid = authStore.user?.uid;
        if (uid) {
            unsubscribe?.();
            startListener(uid);
        }
    };

    return {
        error,
        isPending,
        items,
        reloadData,
    };
};

export function useGetAllPlants(uid) {
    const authStore = useAuthStore();
    const data = ref([]);
    const error = ref(null);
    const isPending = ref(true)

    let unsubscribe = null;

    const startListener = (uid) => {
        error.value = null;
        isPending.value = true;

        if (!uid) {
            error.value = 'User not authenticated';
            isPending.value = false;
            return;
        }

        const q = query(collectionGroup(db, 'plants'));

        unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                data.value = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })).filter((p) => p.userId === uid);
            },
            (err) => {
                isPending.value = false;
                error.value = err.message;
            }
        );
    };

    watchEffect(() => {
        const uid = authStore.user?.uid;
        if (!uid) {
            unsubscribe?.();
            unsubscribe = null;
            items.value = [];
            isPending.value = false;
            return;
        }

        unsubscribe?.();
        startListener(uid);
    });

    onUnmounted(() => {
        unsubscribe?.();
    });

    const reloadData = () => {
        const uid = authStore.user?.uid;
        if (uid) {
            unsubscribe?.();
            startListener(uid);
        }
    };

    return {
        data,
        error,
        isPending,
        reloadData
    };
}
