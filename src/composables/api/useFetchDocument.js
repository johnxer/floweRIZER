import { db } from '@/firebase/config';
import { useAuthStore } from '@/stores/useAuthStore';
import { doc, getDoc } from 'firebase/firestore';
import { ref } from 'vue';

export const useFetchDocument = () => {
    const error = ref(null);
    const isPending = ref(false);
    const authStore = useAuthStore();

    const fetchDocument = async (path) => {
        const uid = authStore.user?.uid;
        if (!uid) return null;

        const docRef = doc(db, `users/${uid}/${path}`);

        try {
            isPending.value = true;
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                isPending.value = false;
                return { id: docSnap.id, ...docSnap.data() };
            } else {
                isPending.value = false;
                return null;
            }
        } catch (error) {
            console.error('Error fetching document:', error);
            error.value = error;

            return null;
        } finally {
            isPending.value = false;
        }
    };

    return { fetchDocument, error, isPending };
};
