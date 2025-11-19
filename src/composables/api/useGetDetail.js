import { useFirestoreSubscribeMulti } from '@/composables/api/useFirestoreSubscribeMulti';
import { db } from '@/firebase/config';
import { useAuthStore } from '@/stores/useAuthStore';
import { doc } from 'firebase/firestore';

export const useGetDetails = (dataType) => {
    const authStore = useAuthStore();

    return useFirestoreSubscribeMulti(
        [() => authStore.user?.uid],
        uid => doc(db, `users/${uid}/${dataType}`),
        true
    )
}