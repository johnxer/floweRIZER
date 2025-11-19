import { collectionGroup, orderBy, query, where } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useFirestoreSubscribe } from './useFirestoreSubscribe';

export const useGetDataByUserId = (dataType) => {
    return useFirestoreSubscribe(
        uid => query(
            collectionGroup(db, dataType), 
            where('userId', '==', uid), 
            orderBy('createdAt', 'desc')
        )
    )
};

