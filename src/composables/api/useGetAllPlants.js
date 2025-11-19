import { collectionGroup, query, where } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuthStore } from '../../stores/useAuthStore';
import { useFirestoreSubscribeMulti } from './useFirestoreSubscribeMulti';

export const useGetAllPlants = () => {
    const authStore = useAuthStore();

    return useFirestoreSubscribeMulti(
        [() => authStore.user?.uid],
        uid => query(
            collectionGroup(db, 'plants'),
            where('userId', '==', uid)
        )
    )
};

