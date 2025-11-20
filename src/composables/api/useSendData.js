import { computed, ref } from 'vue';

import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore';

import { useAuthStore } from '@/stores/useAuthStore';
import { db } from '../../firebase/config';

export const useSendData = () => {
    const authStore = useAuthStore();

    const uid = computed(() => authStore.user?.uid);

    const collectionsMap = {
        chats: (id) => ({
            path: ['users', uid.value, 'chats', id, 'messages'],
            parent: ['users', uid.value, 'chats', id],
        }),
        rooms: () => ({
            path: ['users', uid.value, 'rooms'],
            parent: null,
        }),
        plants: (id) => ({
            path: ['users', uid.value, 'rooms', id, 'plants'],
            parent: null,
        }),
    };

    const isPending = ref(false);
    const error = ref(null);

    const sendData = async (type, data, id) => {
        if (!uid.value) {
            error.value = 'User not authenticated';
            return false;
        }

        const buildPaths = collectionsMap[type];

        if (!buildPaths) {
            error.value = `Invalid data type: ${type}`;
            return false;
        }

        const { path, parent } = buildPaths(id);

        const collectionReference = collection(db, ...path);
        const parentReference = parent ? doc(db, ...parent) : null;

        isPending.value = true;
        error.value = null;

        try {
            const payload = { ...data };

            if (type === 'plants') {
                if (payload.wateredNow) {
                    payload.lastWateredDate = serverTimestamp();
                }

                delete payload.wateredNow;
            }

            const response = await addDoc(collectionReference, {
                createdAt: serverTimestamp(),
                ...payload,
            });

            if (type === 'chats') {
                await updateDoc(parentReference, {
                    lastMessageAt: serverTimestamp(),
                });
            }

            return response.id;
        } catch (err) {
            error.value = err.message;
            return false;
        } finally {
            isPending.value = false;
        }
    };

    return {
        isPending,
        error,
        sendData,
    };
};
