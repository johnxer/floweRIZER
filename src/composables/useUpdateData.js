import { doc, updateDoc } from 'firebase/firestore';
import { ref } from 'vue';
import { db } from '../firebase/config';
import { useAuthStore } from '../stores/useAuthStore';

export const useUpdateData = () => {
    const authStore = useAuthStore()

    const getUid = () => {
        const uid = authStore.user?.uid;

        if (!uid) {
            error.value = 'User not authenticated';
            return null;
        }

        return uid;
    };

    const error = ref(null);
    const isPending = ref(false);

    const updateData = async (data, collectionPath) => {
        const uid = getUid();

        if (!uid) return false;

        isPending.value = true;
        error.value = null;
        const pathReference = `users/${uid}${collectionPath}`

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
