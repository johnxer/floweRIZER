import { deleteDoc, doc } from "firebase/firestore";
import { ref } from "vue";
import { db } from "../firebase/config";


export const useDeleteData = () => {
    const error = ref(null)
    const isPending = ref(false)

    
    const deleteData = async(collectionPath, documentId) => {
        isPending.value = true

        try {
            await deleteDoc(doc(db, collectionPath, documentId));
            console.log('document deleted')

            return true;
        } catch (err){
            error.value = err.message;
            return false;
        } finally {
            isPending.value = false
        }
    }

    return {
        error,
        isPending,
        deleteData
    }
}