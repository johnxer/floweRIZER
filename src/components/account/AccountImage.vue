<template>
    <div>
        <div class="w-[160px] h-[160px] relative rounded-full overflow-hidden shadow-xl border-2 border-white dark:border-gray-700 mx-auto">
            <transition
                name="fade"
                mode="out-in"
            >
                <div
                    v-if="isPending"
                    class="animate-pulse bg-gray-200 dark:bg-gray-700 w-full h-full absolute flex items-center justify-center"
                >
                    <base-loader
                        position="absolute"
                        size="md"
                    />
                </div>
                <div v-else>
                    <label
                        for="user-image"
                        class="cursor-pointer group"
                    >
                        <base-loader
                            v-if="!isImageLoaded"
                            position="absolute"
                            size="md"
                        />
                        <img
                            :src="userAvatarURL"
                            class="object-cover w-full h-full absolute inset-0"
                            :alt="form.userName"
                            loading="lazy"
                            @load="onLoad"
                        />
                        <input
                            type="file"
                            id="user-image"
                            name="user-image"
                            accept="image/png, image/jpeg, image/jpg, image/gif"
                            class="opacity-0"
                            @change="handleFile"
                        />
                        <div class="md:opacity-0 group-hover:opacity-100 flex items-center justify-center absolute w-full h-full inset-0 md:bg-primary/50 text-white text-5xl transition-opacity duration-600">
                            <span class="material-symbols-outlined">
                                edit
                            </span>
                        </div>

                    </label>
                </div>

                <!-- 
                        //*******  Prepared code for password change ******//
                        <base-button
                        v-show="!isCamAllowed"
                        type="button"
                        ref="allowButton"
                        btn-style="notRoundedMd"
                        btn-size="sm"
                        btn-color="neutralAlt"
                        :btn-full-width="false"
                        @click="handleStartCamera"
                    >
                        Allow camera
                    </base-button>

                    <div v-show="isCamAllowed">
                        <div
                            v-show="!isCaptured"
                            class="camera"
                        >
                            <video
                                ref="video"
                                @canplay="handleCanPlay"
                                class="transform -scale-x-100"
                            >Video stream not available.</video>
                            <base-button
                                type="button"
                                btn-style="notRoundedMd"
                                btn-size="sm"
                                btn-color="neutralAlt"
                                :btn-full-width="false"
                                ref="startButton"
                                @click.prevent="handleCapturePhoto"
                            >
                                Capture photo
                            </base-button>
                        </div>
                        <canvas
                            ref="canvas"
                            class="hidden"
                        />
                        <div
                            v-show="isCaptured"
                            class="output"
                        >
                            <img
                                ref="photo"
                                src=""
                                alt="The screen capture will appear in this box."
                            />
                        </div>
                    </div> -->
            </transition>
        </div>
        <transition
            name="fade"
            mode="out-in"
        >

            <Alert
                v-if="error"
                variant="destructive"
                class="mt-6"
            >
                <span class="material-symbols-outlined">
                    error
                </span>
                <AlertDescription>
                    {{ error }}
                </AlertDescription>
            </Alert>
        </transition>
        <transition
            name="fade"
            mode="out-in"
        >

            <Alert
                v-if="isSuccessImage"
                variant="success"
                class="mt-6"
            >
                <span class="material-symbols-outlined">
                    check_circle
                </span>

                <AlertDescription>
                    Image updated!
                </AlertDescription>
            </Alert>
        </transition>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';

import BaseLoader from '@/components/base/BaseLoader.vue';

import {
    Alert,
    AlertDescription
} from '@/components/ui/alert';


import { auth } from '@/firebase/config';
import { updateProfile } from 'firebase/auth';

import { useAuthStore } from '@/stores/useAuthStore';

import { useStorage, useUpdateData } from '@/composables';

import { resizeImageBitmap } from '@/utils';

const authStore = useAuthStore()

const {
    error: errorUploadImage,
    url,
    filePath,
    isPending: isPendingUpload,
    uploadImage,
    deleteImageByUrl
} = useStorage()

const {
    error: errorProfileUpdate,
    isPending: isPendingProfileUpdate,
    updateData,
} = useUpdateData()


const userAvatarURL = computed(() => {
    return authStore.user?.photoURL || 'https://placehold.co/600x600?text=No+Avatar'
})

const form = ref({
    userName: authStore.user?.displayName || '',
    themeColor: '#99c23b'
})

const errorUpdateImage = ref(null)

const isPendingUpdateImage = ref(false)

const isSuccessImage = ref(false)

const error = computed(() => errorUploadImage.value || errorProfileUpdate.value)

const isPending = computed(() => isPendingUpload.value || isPendingUpdateImage.value)

const allowedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']

const handleFile = async (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile || !allowedFormats.includes(selectedFile.type)) return

    const oldPhotoURL = authStore.user?.photoURL || null

    const resizedFile = await resizeImageBitmap(selectedFile, 200, 200)

    const success = await uploadImage('avatars', authStore.user, resizedFile)

    if (!success && auth.currentUser) return

    isPendingUpdateImage.value = true;
    errorUpdateImage.value = null;

    const data = {
        photoURL: url.value,
    }

    try {
        await updateProfile(auth.currentUser, {
            photoURL: url.value,
        })


        await updateData(data)

        authStore.user = {
            ...authStore.user,
            photoURL: url.value,
        }

        if (oldPhotoURL) {
            await deleteImageByUrl(oldPhotoURL)
        }

    } catch (err) {
        errorUpdateImage.value = err.message
    } finally {
        isPendingUpdateImage.value = false;

        isSuccessImage.value = true

        await new Promise((resolve) => setTimeout(resolve, 3000))
        isSuccessImage.value = false
    }
}

const isImageLoaded = ref(false)

const onLoad = () => {
    isImageLoaded.value = true
}


//*******  Prepared code for password change ******//
// const handlePwChange = async () => {
//     await userChangePassword()
// }


//*******  Prepared code for webcam capture on desktop ******//
// const width = 680;
// let height = 0;

// let streaming = false;

// const video = ref(null);
// const canvas = ref(null);
// const photo = ref(null);
// const startButton = ref(null);
// const allowButton = ref(null);
// const isStreaming = ref(false);


// const handleStartCamera = async () => {
//     if (mobileStore.isMobile) return
//     try {
//         const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
//         video.value.srcObject = stream;
//         video.value.play();
//         isStreaming.value = true;
//         permissionResult.value.state = 'granted'
//     } catch (err) {
//         console.error("Camera denied or error:", err);
//     }
// };

// const handleCanPlay = () => {
//     if (!streaming) {
//         height = video.value.videoHeight / (video.value.videoWidth / width);

//         video.value.setAttribute("width", width);
//         video.value.setAttribute("height", height);
//         canvas.value.setAttribute("width", width);
//         canvas.value.setAttribute("height", height);
//         streaming = true;
//     }
// };

// const handleCapturePhoto = () => {
//     takePicture();
// }

// const permissionResult = ref(null);


// const isCamAllowed = computed(() => {
//     return permissionResult.value?.state === 'granted'
// })

// const isCaptured = ref(false)

// onMounted(async () => {
//     clearPhoto();

//     if (navigator.permissions && navigator.permissions.query) {
//         try {
//             permissionResult.value = await navigator.permissions.query({ name: 'camera' });

//             console.log(permissionResult.value)

//             if (permissionResult.value.state === 'granted') {
//                 handleStartCamera();
//             }

//         } catch (error) {
//             console.log("Permissions API not fully supported on this browser.");
//         }
//     }
// })

// const clearPhoto = () => {
//     if (!canvas.value || !photo.value) return;
//     const context = canvas.value.getContext("2d");
//     context.fillStyle = "#aaaaaa";
//     context.fillRect(0, 0, canvas.value.width, canvas.value.height);

//     const data = canvas.value.toDataURL("image/png");
//     photo.value.setAttribute("src", data);
// }

// const takePicture = async () => {
//     if (!canvas.value || !video.value) return;

//     const context = canvas.value.getContext("2d");
//     if (width && height) {
//         canvas.value.width = width;
//         canvas.value.height = height;

//         context.drawImage(video.value, 0, 0, width, height);

//         const dataURL = canvas.value.toDataURL("image/png");

//         console.log(dataURL)

//         if (photo.value) photo.value.setAttribute("src", dataURL);

//         const blob = await (await fetch(dataURL)).blob()
//         const file = new File([blob], `capture-${Date.now()}.png`, { type: "image/png" });

//         handleFile(file)

//         isCaptured.value = true;
//     } else {
//         clearPhoto();
//     }
// }


</script>

<style lang="scss" scoped></style>