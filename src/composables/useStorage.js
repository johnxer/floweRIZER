import { deleteObject, getDownloadURL, ref as storageRef, uploadBytes } from "firebase/storage"
import { ref } from "vue"
import { storage } from "../firebase/config"



export const useStorage = () => {
    const error = ref(null)

    const url = ref(null)

    const filePath = ref(null)

    const isPending = ref(false)

    const uploadImage = async (folder, user, file, subFolder = '') => {
        error.value = null;
        isPending.value = true;

        const timeStamp = Date.now()

        const uniqueFileName = `${timeStamp}_${crypto.randomUUID()}_${file.name}`

        const subFolderPath = subFolder ? `${subFolder}/` : ''

        const fullPath = subFolderPath + uniqueFileName

        filePath.value = `${folder}/${user.uid}/${fullPath}`
        

        const fileReference = storageRef(storage, filePath.value)

        try {

            await uploadBytes(fileReference, file)

            url.value = await getDownloadURL(fileReference)

           return true;

        } catch (err) {
            error.value = err.message
            return false;
        } finally {

            isPending.value = false
        }
    }

    const deleteImageByUrl = async(imageUrl) => {
        error.value = null;
        isPending.value = true;

        const imageToDeleteRefference = storageRef(storage, imageUrl);

            try {
                await deleteObject(imageToDeleteRefference)

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
        uploadImage,
        deleteImageByUrl
    }
}

