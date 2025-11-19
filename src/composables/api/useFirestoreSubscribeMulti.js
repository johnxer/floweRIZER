import { onSnapshot } from 'firebase/firestore';
import { onUnmounted, ref, watch } from 'vue';

export const useFirestoreSubscribeMulti = (sources, buildRefFn, isSingleDoc = false) => {
    const data = ref(isSingleDoc ? null : []);
    const error = ref(null);
    const isPending = ref(true);

    let unsubscribe = null;

    let token = null;

    const cleanup = () => {
        if (unsubscribe) unsubscribe();
        unsubscribe = null;
    };

    const start = (...values) => {
        cleanup();

        if (values.some((v) => !v)) {
            data.value = ref(isSingleDoc ? null : []);
            error.value = null;
            isPending.value = false;
            return;
        }

        error.value = null;
        isPending.value = true;

        const refOrQuery = buildRefFn(...values);
        const localToken = ++token;

        unsubscribe = onSnapshot(
            refOrQuery,
            (snapshot) => {
                if (token !== localToken) return;

                if (isSingleDoc) {
                    data.value = snapshot.exists()
                        ? {
                              id: snapshot.id,
                              ...snapshot.data(),
                          }
                        : (data.value = null);
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
                if (token !== localToken) return;
                error.value = err.message;
                isPending.value = false;
            }
        );
    };

    watch(sources, (values) => start(...values), {
        immediate: true,
        deep: false,
    });

    onUnmounted(cleanup);

    const reload = () => {
        const values = sources.map((src) => (typeof src === 'function' ? src() : src.value));
        start(...values);
    };

    return {
        data,
        error,
        isPending,
        reload,
    };
};
