import { collectionGroup, query, where } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useFirestoreSubscribe } from './useFirestoreSubscribe';

export const useGetAllPlants = (dataType) => {
    return useFirestoreSubscribe(
        uid => query(
            collectionGroup(db, 'plants'),
            where('userId', '==', uid)
        )
    )
};

