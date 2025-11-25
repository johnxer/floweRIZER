import { db } from '@/firebase/config';
import { useAuthStore } from '@/stores/useAuthStore';
import { normalizePath } from '@/utils';
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { ref } from 'vue';

export const useDeleteData = () => {
    const authStore = useAuthStore();

    const error = ref(null);
    const isPending = ref(false);

    const deleteData = async (documentId, collectionPath) => {
        const uid = authStore.uid;

        if (!uid) {
            error.value = 'User not authenticated';
            return false;
        }

        isPending.value = true;
        error.value = null;

        const pathReference = collectionPath ? `users/${uid}/${normalizePath(collectionPath)}` : `users/${uid}`;

        try {
            await deleteDoc(doc(db, pathReference, documentId));

            return true;
        } catch (err) {
            error.value = err.message;

            return false;
        } finally {
            isPending.value = false;
        }
    };

    // helper
    const deleteCollectionRecursive = async (path) => {
        console.log(`[deleteCollectionRecursive] Starting for path: ${path}`);
        const colRef = collection(db, path);

        try {
            const snapshot = await getDocs(colRef);

            for (const docSnap of snapshot.docs) {
                await deleteDoc(docSnap.ref);
            }

            return true;
        } catch (err) {
            throw err;
        }
    };

    const deleteUserFirestore = async (uid) => {
        console.log('Auth UID:', authStore.user?.uid);
        console.log('Store UID:', uid);

        isPending.value = true;
        error.value = null;

        try {
            // delete rooms data
            await deleteCollectionRecursive(`users/${uid}/rooms`);

            // delete plants data
            await deleteCollectionRecursive(`users/${uid}/plants`);

            // delete chat messeages data
            const chats = await getDocs(collection(db, `users/${uid}/chats`));
            for (const chat of chats.docs) {
                await deleteCollectionRecursive(`users/${uid}/chats/${chat.id}/messages`);
            }

            // delete chats data
            await deleteCollectionRecursive(`users/${uid}/chats`);

            // delete user data
            await deleteDoc(doc(db, `users/${uid}`));

            return true;
        } catch (err) {
            error.value = err.message;
        } finally {
            isPending.value = false;
        }
    };

    return {
        error,
        isPending,
        deleteData,
        deleteUserFirestore,
    };
};
