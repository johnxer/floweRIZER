import { collection, orderBy, query } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuthStore } from '../../stores/useAuthStore';
import { useFirestoreSubscribeMulti } from './useFirestoreSubscribeMulti';

export const useGetData = (dataType) => {
    const authStore = useAuthStore();

    return useFirestoreSubscribeMulti(
        [() => authStore.user?.uid],
        (uid) => query(
            collection(db, `users/${uid}/${dataType}`), 
            orderBy('createdAt', 'desc'))
    );
};
