import { collectionGroup, getDocs, query, where } from 'firebase/firestore'
import { db } from '../../firebase/config'
import { useAuthStore } from '../../stores/useAuthStore'

export const useFindRoomIdByPlantId = () => {
    const authStore = useAuthStore()

    const findRoomIdByPlantId = async (plantId) => {
        const uid = authStore.user?.uid
        if (!uid) return null

        const q = query(
            collectionGroup(db, 'plants'),
            where('userId', '==', uid)
        )

        const snapshot = await getDocs(q)

        if (snapshot.empty) return null

        const doc = snapshot.docs.find(d => d.id === plantId)
        if (!doc) return null

        const parts = doc.ref.path.split('/')
        const roomId = parts[parts.indexOf('rooms') + 1]

        return roomId
    }

    return { findRoomIdByPlantId }
}
