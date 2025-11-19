import { collectionGroup, orderBy, query, where } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuthStore } from '../../stores/useAuthStore';
import { useFirestoreSubscribeMulti } from './useFirestoreSubscribeMulti';

export const useGetDataByUserId = (dataType) => {
    const authStore = useAuthStore();
    
    return useFirestoreSubscribeMulti(
        [() => authStore.user?.uid],
        uid => query(
            collectionGroup(db, dataType), 
            where('userId', '==', uid), 
            orderBy('createdAt', 'desc')
        )
    )
};

