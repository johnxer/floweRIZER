import { doc, updateDoc } from 'firebase/firestore';
import { ref } from 'vue';
import { db } from '../firebase/config';
import { useAuth } from './useAuth';

export const useUpdateData = () => {
    const { getUid } = useAuth()

    const error = ref(null);
    const isPending = ref(false);

    const updateData = async (data, collectionPath) => {
        const uid = getUid();

        if (!uid) return false;

        isPending.value = true;
        error.value = null;

        let pathReference;

        if (!collectionPath) {
            pathReference = `users/${uid}`
        } else {
            pathReference = `users/${uid}/${collectionPath}`
        }


        const userReference = doc(db, pathReference);

        try {
            await updateDoc(userReference, data);

            return true;
        } catch (err) {
            error.value = err.message;
            return false;
        } finally {
            isPending.value = false;
        }
    };

    return {
        error,
        isPending,
        updateData,
    };
};
