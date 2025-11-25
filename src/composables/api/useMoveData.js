import { db } from '@/firebase/config';
import { useAuthStore } from '@/stores/useAuthStore';
import { arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, setDoc, updateDoc, writeBatch } from 'firebase/firestore';
import { ref } from 'vue';

export const useMoveData = () => {
    const authStore = useAuthStore();

    const movedCount = ref(0);

    const error = ref(null);
    const isPending = ref(false);

    const movePlants = async (oldRoomId, newRoomId) => {
        const uid = authStore.uid;

        if (!uid) {
            error.value = 'User not authenticated';
            return false;
        }

        isPending.value = true;
        error.value = null;
        movedCount.value = 0;

        try {
            const newRoomReference = doc(db, `users/${uid}/rooms/${newRoomId}`);
            const newRoomSnapshot = await getDoc(newRoomReference);

            if (!newRoomSnapshot.exists()) {
                await sendData(
                    'rooms',
                    {
                        id: newRoomId,
                        name: newRoomId === 'unassigned' ? 'Unassigned' : 'New room',
                    },
                    'unassigned'
                );
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
        const uid = authStore.uid;

        if (!uid) {
            error.value = 'User not authenticated';
            return false;
        }

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
        movePlants,
        movePlant,
    };
};
