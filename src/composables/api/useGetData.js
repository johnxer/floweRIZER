import { collection, orderBy, query } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useFirestoreSubscribe } from './useFirestoreSubscribe';

export const useGetData = (dataType) => {
    return useFirestoreSubscribe((uid) => query(
        collection(db, `users/${uid}/${dataType}`), 
        orderBy('createdAt', 'desc'))
    );
};
