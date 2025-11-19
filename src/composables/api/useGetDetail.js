import { doc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useFirestoreSubscribe } from './useFirestoreSubscribe';

export const useGetDetails = (dataType) => {

    return useFirestoreSubscribe(
        uid => doc(db, `users/${uid}/${dataType}`),
        true
    )
}