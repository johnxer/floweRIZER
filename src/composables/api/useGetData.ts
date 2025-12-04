import { useFirestoreSubscribeMulti } from '@/composables/api/useFirestoreSubscribeMulti';
import { db } from '@/firebase/config';
import { useAuthStore } from '@/stores/useAuthStore';
import { CollectionDocument, CollectionName } from '@/types/firestore';
import { collection, orderBy, query } from 'firebase/firestore';
import type { Ref } from 'vue';

export const useGetData = <T extends CollectionName>(
    dataType: T
) => {

    const authStore = useAuthStore();

    const q = (uid: string) => 
        query(
            collection(db, `users/${uid}/${dataType}`), 
            orderBy('createdAt', 'desc')
        )

    const {data, error, isPending,reload} = useFirestoreSubscribeMulti(
        [() => authStore.user?.uid], 
        q
    )

    return {
        data: data as unknown as Ref<CollectionDocument<T>[]>,
        error,
        isPending,
        reload,
    }
};
