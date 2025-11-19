import { useFirestoreSubscribeMulti } from '@/composables/api/useFirestoreSubscribeMulti';
import { db } from '@/firebase/config';
import { useAuthStore } from '@/stores/useAuthStore';
import { collectionGroup, orderBy, query, where } from 'firebase/firestore';

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

