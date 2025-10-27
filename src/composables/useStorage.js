import { getDownloadURL, ref as storageRef, uploadBytes } from "firebase/storage"
import { ref } from "vue"
import { storage } from "../firebase/config"


export const useStorage = () => {
    const error = ref(null)

    const url = ref(null)

    const filePath = ref(null)

    const isPending = ref(false)


    const uploadImage = async (folder, user, file) => {
        error.value = null;
        isPending.value = true;

        filePath.value = `${folder}/${user.uid}/${file.name}`

        const fileRef = storageRef(storage, filePath.value)

        console.log(fileRef)

        try {

            await uploadBytes(fileRef, file)

            url.value = await getDownloadURL(fileRef)

            console.log('File URL:', url.value)

            return true;

        } catch (err) {
            error.value = err.message
            return false;
        } finally {

            isPending.value = false
        }
    }

    return {
        error,
        url,
        filePath,
        isPending,
        uploadImage
    }
}

