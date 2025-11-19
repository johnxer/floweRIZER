import { db } from '@/firebase/config';
import { useAuthStore } from '@/stores/useAuthStore';
import { useFirestoreSubscribeMulti } from '@/composables/api/useFirestoreSubscribeMulti';
import { collection, orderBy, query } from 'firebase/firestore';

export const useGetData = (dataType) => {
    const authStore = useAuthStore();

    return useFirestoreSubscribeMulti(
        [() => authStore.user?.uid],
        (uid) => query(
            collection(db, `users/${uid}/${dataType}`), 
            orderBy('createdAt', 'desc'))
    );
};
