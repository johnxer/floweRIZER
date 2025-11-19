import { collection, orderBy, query } from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuthStore } from "../stores/useAuthStore";
import { useFirestoreSubscribeMulti } from "./api/useFirestoreSubscribeMulti";

export const useGetChatData = (chatIdRef) => {
    const authStore = useAuthStore();

    return useFirestoreSubscribeMulti(
        [() => authStore.user?.uid, chatIdRef],
        (uid, chatId) => query
            (
                collection(db, `users/${uid}/chats/${chatId}/messages`),
                orderBy('createdAt', 'asc')
            )
    )
}