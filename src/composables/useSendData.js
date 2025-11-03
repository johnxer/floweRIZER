import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { db } from '../firebase/config';
import { useAuthStore } from '../stores/useAuthStore';

export const useSendData = () => {
    const isPending = ref(false);
    const error = ref(null);

    const { user } = storeToRefs(useAuthStore());

    const sendDataChats = async (chatId, data) => {

        if (!user.value) {
            error.value = 'User not authenticated';
            return false;
        }

        isPending.value = true;
        error.value = null;

        const chatPath = `users/${user.value.uid}/chats/${chatId}`;
        const chatReference = doc(db, chatPath);
        const messagesReference = collection(db, `${chatPath}/messages`);

        console.log('Data odesílaná do Firestore:', data);

        try {
            const response = await addDoc(messagesReference, {
                createdAt: serverTimestamp(),
                ...data,
            });

            await updateDoc(chatReference, {
                lastMessageAt: serverTimestamp(),
            });

            console.log(response.id);

            return true;
        } catch (err) {
            error.value = err.message;
            return false;
        } finally {
            isPending.value = false;
        }
    };

    const sendDataRooms = async (data) => {

        if (!user.value) {
            error.value = 'User not authenticated';
            return false;
        }

        isPending.value = true;
        error.value = null;

        const roomPath = `users/${user.value.uid}/rooms`;
        const roomReference = collection(db, `${roomPath}`);

        try {
            const response = await addDoc(roomReference, {
                createdAt: serverTimestamp(),
                ...data,
            });

            console.log(response.id);

            return true;
        } catch (err) {
            error.value = err.message;
            return false;
        } finally {
            isPending.value = false;
        }
    };

    const sendDataPlants = async (data, roomId) => {

        if (!user.value) {
            error.value = 'User not authenticated';
            return false;
        }

        isPending.value = true;
        error.value = null;

        const plantCollection = collection(db, `users/${user.value.uid}/rooms/${roomId}/plants`);
        
        if (data.wateredNow) {
            data = {
                ...data,
                lastWateredDate: serverTimestamp()
            }
            
        }


        try {
            await addDoc(plantCollection, {
                ...data,
                createdAt: serverTimestamp(),
            });

            return true;
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
        sendDataChats,
        sendDataRooms,
        sendDataPlants,
    };
};
