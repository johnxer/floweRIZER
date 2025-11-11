import { doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { ref } from 'vue';
import { db } from '../firebase/config';
import { usePlantsStore } from '../stores/usePlantsStore';
import { normalizePath } from '../utils/normalizePath';
import { useAuth } from './useAuth';
import { useFindRoomIdByPlantId } from './useFindRoomIdByPlantId';

export const useUpdateData = () => {
    const { getUid } = useAuth();
    const { findRoomIdByPlantId } = useFindRoomIdByPlantId();

    const plantsStore = usePlantsStore();

    const error = ref(null);
    const isPending = ref(false);

    const updateData = async (data, collectionPath) => {
        const uid = getUid();

        if (!uid) return false;

        isPending.value = true;
        error.value = null;

        const pathReference = collectionPath ? `users/${uid}/${normalizePath(collectionPath)}` : `users/${uid}`;

        const docReference = doc(db, pathReference);

        try {
            await updateDoc(docReference, data);

            return true;
        } catch (err) {
            error.value = err.message;
            return false;
        } finally {
            isPending.value = false;
        }
    };

    const waterPlant = async (plantId, roomId = null) => {
        const uid = getUid();

        if (!uid) return false;

        isPending.value = true;
        error.value = null;

        try {
            const foundRoomId = roomId || (await findRoomIdByPlantId(plantId));

            if (!foundRoomId) {
                error.value = 'Room not found for this plant';
                return false;
            }

            const data = {
                lastWateredDate: serverTimestamp(),
            };

            const success = await updateData(data, `rooms/${foundRoomId}/plants/${plantId}`);

            if (success) {
                plantsStore.markAsWatered(plantId);
            }

            return success;
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
        waterPlant,
    };
};
