<template>
    <base-container>
        <!-- <base-page-title>
            Profile
        </base-page-title> -->

        <div class="md:max-w-[400px] max-w-full grid mx-auto gap-8 items-start grid-cols-[1fr]">
            <div class="w-full">
                <div class="w-[200px] h-[200px] relative rounded-full overflow-hidden shadow-2xl border-2 border-white dark:border-gray-700 mx-auto">
                    <transition
                        name="fade"
                        mode="out-in"
                    >
                        <div
                            v-if="isPending"
                            class="animate-pulse bg-gray-200 dark:bg-gray-700 w-full h-full absolute flex items-center justify-center"
                        >
                            <base-loader position-type="absolute" />
                        </div>
                        <div v-else>
                            <label
                                for="user-image"
                                class="cursor-pointer group"
                            >
                                <base-loader
                                    v-if="!isImageLoaded"
                                    class="absolute inset-0"
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
                    </transition>
                </div>
                <transition
                    name="fade"
                    mode="out-in"
                >
                    <base-form-message-box
                        v-if="errorUploadImage || errorUpdateImage"
                        message-type="error"
                        class="mt-4"
                    >
                        {{ errorUploadImage || errorUpdateImage }}
                    </base-form-message-box>
                </transition>
                <transition
                    name="fade"
                    mode="out-in"
                >
                    <base-form-message-box
                        v-if="isSuccessImage"
                        message-type="success"
                        class="mt-4"
                    >
                        Image updated!
                    </base-form-message-box>
                </transition>
            </div>
            <div>
                <div class="relative">
                    <transition
                        name="fade"
                        mode="out-in"
                    >
                        <base-loader
                            v-if="isPendingProfileUpdate"
                            position-type="absolute"
                            class="bg-gray-100/80 z-1"
                        />
                    </transition>
                    <form
                        @submit.prevent="submitForm"
                        novalidate
                    >
                        <div class="space-y-4">
                            <base-input-wrapper-authed
                                field-label="Your username"
                                field-id="user-name"
                                :errorText="formErrors.userName"
                            >
                                <base-input
                                    input-id="user-name"
                                    input-placeholder="Enter user name..."
                                    :input-error="!!formErrors.userName"
                                    class="w-full"
                                    v-model.trim="form.userName"
                                    @click="formErrors.userName = null"
                                />
                            </base-input-wrapper-authed>
                            <base-input-wrapper-authed
                                field-label="Your email"
                                field-label-extra="Cannot be changed"
                                field-id="email"
                            >
                                <base-input
                                    input-type="email"
                                    input-id="email"
                                    input-placeholder="Enter email..."
                                    class="w-full"
                                    readonly
                                    v-model.trim="emailValue"
                                />
                            </base-input-wrapper-authed>
                            <base-input-wrapper-authed
                                field-label="Theme colour"
                                field-id="theme-color"
                            >
                                <div class="rounded-lg overflow-hidden size-[34px] relative border-2 border-gray-300">
                                    <input
                                        type="color"
                                        id="theme-color"
                                        class="focus:outline-0 border-0 p-0 absolute inset-0 w-full h-full cursor-pointer"
                                        v-model="form.themeColor"
                                    >
                                </div>
                            </base-input-wrapper-authed>
                        </div>

                        <base-button
                            class="mt-8"
                            btn-style="notRoundedMd"
                            :disabled="isPendingProfileUpdate"
                            btn-size="base"
                        >
                            Save
                        </base-button>

                        <!-- <base-button
                            class="mt-8"
                            btn-style="notRoundedMd"
                            :disabled="isPendingProfileUpdate"
                            btn-size="base"
                            @click="handlePwChange"
                            type="button"
                        >
                            ChangePw
                        </base-button> -->

                    </form>
                </div>

                <hr class="border-gray-200 dark:border-gray-800 my-6" />
                <base-button
                    btn-style="notRoundedMd"
                    btn-size="base"
                    btn-color="danger"
                    :disabled="isPendingProfileUpdate"
                    @click="toggleModal"
                >
                    Delete account
                </base-button>

            </div>
        </div>
        <teleport to="body">
            <base-modal
                :modal-toggle="isModalOpen"
                @close-modal="toggleModal"
            >
                <confirm-delete-account-content @close-modal="toggleModal" />

            </base-modal>
        </teleport>
    </base-container>
</template>

<script setup>
import { computed, ref } from 'vue';

import { auth } from '@/firebase/config';
import { updateProfile } from 'firebase/auth';
import { storeToRefs } from 'pinia';

import BaseButton from '@/components/base/BaseButtons/BaseButton.vue';
import BaseContainer from '@/components/base/BaseContainer.vue';
import BaseFormMessageBox from '@/components/base/BaseForm/BaseFormMessageBox.vue';
import BaseInput from '@/components/base/BaseForm/BaseInput.vue';
import BaseInputWrapperAuthed from '@/components/base/BaseForm/BaseInputWrapperAuthed.vue';
import BaseLoader from '@/components/base/BaseLoader.vue';
import BaseModal from '@/components/base/BaseModal/BaseModal.vue';

import ConfirmDeleteAccountContent from '@/components/features/auth/ConfirmDeleteAccountContent.vue';

import { useAuthStore } from '@/stores/useAuthStore';

import { useAuth, useAuthActions, useStorage, useUpdateData } from '@/composables';
import { resizeImageBitmap } from '@/utils';

const {
    user,
    error: errorUserStore,
    isPending: isPendingUserStore
} = storeToRefs(useAuthStore())

const {
    updateProfileData
} = useAuth()

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

const { userChangePassword } = useAuthActions()

const userAvatarURL = computed(() => {
    return user.value?.photoURL || 'https://placehold.co/600x600?text=No+Avatar'
})

const emailValue = user.value?.email;

const form = ref({
    userName: user.value.displayName || '',
    themeColor: '#99c23b'
})

const errorUpdateImage = ref(null)

const isPendingUpdateImage = ref(false)

const isSuccessImage = ref(false)

isSuccessImage.value = false

const isPending = computed(() => isPendingUpload.value || isPendingUpdateImage.value)

const allowedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']

const handleFile = async (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile || !allowedFormats.includes(selectedFile.type)) return

    const oldPhotoURL = user.value?.photoURL || null

    const resizedFile = await resizeImageBitmap(selectedFile, 200, 200)

    const success = await uploadImage('avatars', user.value, resizedFile)

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

        // const uid = user.value?.uid || auth.currentUser.uid

        await updateData(data)

        user.value = {
            ...user.value,
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

const isModalOpen = ref(false)

const toggleModal = (state) => {
    if (typeof state === 'boolean') {
        isModalOpen.value = state
    } else {
        isModalOpen.value = !isModalOpen.value
    }
}


const formErrors = ref({})

const validateForm = () => {
    formErrors.value = {}

    if (!form.value.userName) {
        formErrors.value.userName = 'Username cannot be empty'
    }

    return Object.keys(formErrors.value).length === 0
}

const submitForm = async () => {
    if (!validateForm()) return

    const dataProfile = {
        displayName: form.value.userName,

    }

    const data = {
        customColor: form.value.themeColor,
        ...dataProfile
    }

    console.log(data)
    console.log(dataProfile)
    console.log(user.value.uid)
    console.log(data)

    const successProfile = await updateProfileData(dataProfile)
    const successUserDb = await updateData(data)

    if (successProfile && successUserDb) {

        console.log('success')

    }
}

const isImageLoaded = ref(false)

const onLoad = () => {
    isImageLoaded.value = true
}

const handlePwChange = async () => {
    await userChangePassword()
}

</script>

<style lang="scss" scoped></style>