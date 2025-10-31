import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { storeToRefs } from 'pinia';
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { db } from '../firebase/config';
import { useAuthStore } from '../stores/useAuthStore';

export const useGetData = (dataType) => {
    const { user } = storeToRefs(useAuthStore());

    const error = ref(null);
    const isPending = ref(true);

    const items = ref([]);

    const itemPath = `users/${user.value.uid}/${dataType}`;

    console.log('itemPath', itemPath)

    let unsubscribe = null

    const q = query(collection(db, itemPath), orderBy('createdAt', 'desc'));
    const startListener = () => {
        if (!user.value?.uid) {
            error.value = 'User not authenticated';
            isPending.value = false;
            return;
        }

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
                console.error(err);
                error.value = err.message;
                isPending.value = false;
            }
            
        );
    };




    onMounted(() => {
        if (user.value?.uid) startListener();
    });

    watch(() => user.value?.uid, (newUid) => {
            if (newUid && !unsubscribe) {
                startListener();
            }
        }
    );

    onUnmounted(() => {
        unsubscribe();
    });

    
    return {
        error,
        isPending,
        items,
    };
};
