import { collection, deleteDoc, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { ref } from 'vue';
import { db } from '../firebase/config';
import { normalizePath } from '../utils/normalizePath';
import { useAuth } from './useAuth';

export const useDeleteData = () => {
    const { getUid } = useAuth()

    const uid = getUid();

    if (!uid) return false;

    const error = ref(null);
    const isPending = ref(false);

    const deleteData = async (documentId, collectionPath) => {
        isPending.value = true;
        error.value = null;

        const pathReference = collectionPath ? `users/${uid}/${normalizePath(collectionPath)}` : `users/${uid}`;

        console.log(pathReference)
        
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

    const movedCount = ref(0);

    const movePlants = async (oldRoomId, newRoomId) => {
        isPending.value = true;
        error.value = null;
        movedCount.value = 0;

        try {
            const oldPlantsReference = collection(db, `users/${uid}/rooms/${oldRoomId}/plants`);
            const snapshot = await getDocs(oldPlantsReference);

            if (snapshot.empty) {
                return 0;
            }

            for (const plantDocument of snapshot.docs) {
                try {
                    const plantData = plantDocument.data();

                    const newPlantsReference = doc(db, `users/${uid}/rooms/${newRoomId}/plants`, plantDocument.id);

                    await setDoc(newPlantsReference, plantData);

                    await deleteDoc(plantDocument.ref);

                    movedCount.value++;
                } catch (err) {
                    console.log(err.message);
                }
            }

            return movedCount.value;
        } catch (err) {
            error.value = err.message;

            return 0;
        } finally {
            isPending.value = false;
        }
    };

    const movePlant = async (oldRoomId, newRoomId, plantId) => {
        isPending.value = true;
        error.value = null;

        try {
            const oldPlantReference = doc(db, `users/${uid}/rooms/${oldRoomId}/plants`, plantId);
            const oldSnap = await getDoc(oldPlantReference);

            if (!oldSnap.exists()) {
                throw new Error('Plant not found');
            }

            const plantData = oldSnap.data();

            const newPlantReference = doc(db, `users/${uid}/rooms/${newRoomId}/plants`, plantId);
            await setDoc(newPlantReference, plantData);

            await deleteDoc(oldPlantReference);

            return true;
        } catch (err) {
            error.value = err.message;
            console.error('Move plant failed:', err);
            return false;
        } finally {
            isPending.value = false;
        }
    };

    return {
        error,
        isPending,
        movedCount,
        deleteData,
        movePlants,
        movePlant
    };
};
