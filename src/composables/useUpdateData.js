import { doc, updateDoc } from 'firebase/firestore';
import { ref } from 'vue';
import { db } from '../firebase/config';

export const useUpdateData = () => {
    const error = ref(null);
    const isPending = ref(false);

    const updateUserData = async (collection, userId, data) => {
        isPending.value = true;
        error.value = null;
        const userReference = doc(db, collection, userId);

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
        updateUserData,
    };
};
