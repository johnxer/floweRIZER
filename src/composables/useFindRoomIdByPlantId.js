import { collectionGroup, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuthStore } from '../stores/useAuthStore';

export const useFindRoomIdByPlantId = () => {
    const authStore = useAuthStore();

    const getUid = () => {
        const uid = authStore.user?.uid;

        if (!uid) {
            error.value = 'User not authenticated';
            return null;
        }

        return uid;
    };

    const findRoomIdByPlantId = async (plantId) => {
        const uid = getUid();

        if (!uid) return false;


        const q = query(collectionGroup(db, 'plants'), where('userId', '==', uid));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            return null;
        }

        const doc = snapshot.docs.find((d) => d.id === plantId);
        if (!doc) {
            return null;
        }

        const fullPath = doc.ref.path;

        const parts = fullPath.split('/');
        const roomIdIndex = parts.indexOf('rooms') + 1;
        const roomId = parts[roomIdIndex];

        return roomId;
    };

    return { 
        findRoomIdByPlantId
    };
};
