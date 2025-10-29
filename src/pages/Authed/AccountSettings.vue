<template>
    <div>
        <base-page-title>
            Account
        </base-page-title>

        <div class="lg:max-w-[600px] md:max-w-[400px] max-w-full grid lg:grid-cols-[auto_1fr] mx-auto gap-8 items-start grid-cols-[1fr]">
            <div class="w-[200px]">
                <div class="w-[200px] h-[200px] relative rounded-full overflow-hidden shadow-2xl border-2 border-white dark:border-gray-700 mx-auto">
                    <transition
                        name="fade"
                        mode="out-in"
                    >
                        <div
                            v-if="isPending"
                            class="animate-pulse bg-gray-200 dark:bg-gray-700 w-full h-full absolute flex items-center justify-center"
                        >
                            <base-loader 
                                position-type="absolute"
                            />
                        </div>
                        <label
                            v-else
                            for="user-image"
                            class="cursor-pointer group"
                        >
                            <img
                                :src="userAvatarURL"
                                class="object-cover w-full h-full absolute inset-0"
                            />
                            <input
                                type="file"
                                id="user-image"
                                name="user-image"
                                accept="image/png, image/jpeg"
                                class="opacity-0"
                                @change="handleFile"
                            />
                            <div class="opacity-0 group-hover:opacity-100 flex items-center justify-center absolute w-full h-full inset-0 bg-primary/50 text-white text-5xl transition-opacity duration-600">
                                <span class="material-symbols-outlined">
                                    edit
                                </span>
                            </div>

                        </label>
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
                <form
                    @submit.prevent=""
                    novalidate
                >
                    <div class="space-y-4">
                        <base-input-wrapper-authed
                            field-label="Your username"
                            field-id="user-name"
                        >
                            <input
                                type="text"
                                id="user-name"
                                placeholder="Enter user name..."
                                class="px-4 py-2 rounded-xl border-2 border-gray-300 w-full focus:outline-0 focus:border-primary transition-colors duration-600 text-gray-500 dark:text-white/75 dark:border-gray-500"
                            >
                        </base-input-wrapper-authed>
                        <base-input-wrapper-authed
                            field-label="Your email"
                            field-label-extra="Cannot be changed"
                            field-id="email"
                        >
                            <input
                                type="email"
                                id="email"
                                placeholder="Enter email..."
                                class="px-4 py-2 rounded-xl border-2 border-gray-300 w-full read-only:cursor-not-allowed focus:outline-0 read-only:opacity-50 text-gray-500 dark:text-white/75 dark:border-gray-500"
                                readonly
                                v-model="emailValue"
                            >
                        </base-input-wrapper-authed>
                    </div>
                    <base-button
                        class="mt-8"
                        btn-style="notRounded"
                        btn-size="base"
                    >
                        Save
                    </base-button>

                    <hr class="border-gray-300 dark:border-gray-800 my-6" />
                    <base-button
                        btn-style="notRounded"
                        btn-size="base"
                        btn-color="danger"
                        @click="toggleModal"
                    >
                        Delete account
                    </base-button>
                </form>
            </div>
        </div>
        <base-modal
            :modal-toggle="isModalOpen"
            @close-modal="toggleModal"
        >
            <div>

                </div>
            
        </base-modal>
    </div>
</template>

<script setup>

import BasePageTitle from '../../components/Base/BasePageTitle.vue';
import BaseButton from '../../components/Base/BaseButton.vue';
import BaseFormMessageBox from '../../components/Base/BaseFormMessageBox.vue';
import BaseModal from '../../components/Base/BaseModal/BaseModal.vue';
import BaseLoader from '../../components/Base/BaseLoader.vue';

import { computed, ref } from 'vue';
import { useAuthStore } from '../../stores/useAuthStore';
import { storeToRefs } from 'pinia';
import { useStorage } from '../../composables/useStorage';
import { updateProfile } from 'firebase/auth';
import { auth, db } from '../../firebase/config';
import BaseInputWrapperAuthed from '../../components/Base/BaseInputWrapperAuthed.vue';
import { doc, updateDoc } from 'firebase/firestore';

const {
    user
} = storeToRefs(useAuthStore())

const {
    error: errorUploadImage,
    url,
    filePath,
    isPending: isPendingUpload,
    uploadImage,
    deleteImageByUrl
} = useStorage()

const userAvatarURL = computed(() => {
    return user.value?.photoURL || 'https://via.placeholder.com/200?text=No+Avatar'
})

const emailValue = user.value?.email;

const form = ref({
    displayName: user.value.displayName || '',
})

const errorUpdateImage = ref(null)

const isPendingUpdateImage = ref(false)

const isSuccessImage = ref(false)

isSuccessImage.value = false

const isPending = computed(() => isPendingUpload.value || isPendingUpdateImage.value)

const allowedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']

const handleFile = async (e) => {
    const selectedFile = e.target.files[0];

    console.log(selectedFile)

    if (!selectedFile || !allowedFormats.includes(selectedFile.type)) {
        console.log(`${selectedFile.type} is not allowed`)
        return
    }

    const oldPhotoUrl = user.value?.photoURL || null

    const success = await uploadImage('avatars', user.value, selectedFile)

    if (!success && auth.currentUser) return

    isPendingUpdateImage.value = true;
    errorUpdateImage.value = null;

    try {
        await updateProfile(auth.currentUser, {
            photoURL: url.value,
        })

        const uid = user.value?.uid || auth.currentUser.uid

        const userReference = doc(db, 'users', uid);

        await updateDoc(userReference, {
            photoUrl: url.value,
        });

        user.value = {
            ...user.value,
            photoURL: url.value,
        }

        if (oldPhotoUrl) {
            await deleteImageByUrl(oldPhotoUrl)
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

</script>

<style lang="scss" scoped></style>