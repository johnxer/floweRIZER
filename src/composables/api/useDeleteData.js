import { useAuth } from '@/composables/auth';
import { db } from '@/firebase/config';
import { normalizePath } from '@/utils';
import { arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, setDoc, updateDoc, writeBatch } from 'firebase/firestore';
import { ref } from 'vue';

export const useDeleteData = () => {
    const { getUid } = useAuth();

    const uid = getUid();

    if (!uid) return false;

    const error = ref(null);
    const isPending = ref(false);

    const deleteData = async (documentId, collectionPath) => {
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

    const movedCount = ref(0);

    const movePlants = async (oldRoomId, newRoomId) => {
        isPending.value = true;
        error.value = null;
        movedCount.value = 0;

        try {
            const newRoomReference = doc(db, `users/${uid}/rooms/${newRoomId}`);
            const newRoomSnapshot = await getDoc(newRoomReference);

            if (!newRoomSnapshot.exists()) {
                await sendDataRooms({
                    id: newRoomId,
                    name: newRoomId === 'unassigned' ? 'Unassigned' : 'New room',
                });
            }

            const oldPlantsReference = collection(db, `users/${uid}/rooms/${oldRoomId}/plants`);
            const snapshot = await getDocs(oldPlantsReference);

            if (snapshot.empty) {
                return 0;
            }

            const batch = writeBatch(db);

            snapshot.forEach((docSnap) => {
                const plantData = docSnap.data();
                const newPlantRef = doc(db, `users/${uid}/rooms/${newRoomId}/plants/${docSnap.id}`);
                batch.set(newPlantRef, plantData);
                batch.delete(docSnap.ref);
                movedCount.value++;
            });

            await batch.commit();

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

            await updateDoc(newPlantReference, {
                log: arrayUnion({
                    id: crypto.randomUUID(),
                    action: 'moved',
                    date: new Date().toISOString(),
                    origin: oldRoomId,
                    target: newRoomId,
                }),
            });

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
        movePlant,
    };
};
