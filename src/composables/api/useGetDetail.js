import { doc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuthStore } from '../../stores/useAuthStore';
import { useFirestoreSubscribeMulti } from './useFirestoreSubscribeMulti';

export const useGetDetails = (dataType) => {
    const authStore = useAuthStore();

    return useFirestoreSubscribeMulti(
        [() => authStore.user?.uid],
        uid => doc(db, `users/${uid}/${dataType}`),
        true
    )
}