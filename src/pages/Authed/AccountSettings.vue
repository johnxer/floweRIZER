<template>
    <div>
        <base-page-title>
            Account
        </base-page-title>

        <div class="lg:max-w-[600px] md:max-w-[400px] max-w-full grid lg:grid-cols-[auto_1fr] mx-auto gap-8 items-start grid-cols-[1fr]">
            <div>
                <div class="w-[200px] h-[200px] relative rounded-full overflow-hidden shadow-2xl border-2 border-white dark:border-gray-700 mx-auto">
                    <transition
                        name="fade"
                        mode="out-in"
                    >
                        <div
                            v-if="isPendingUpload"
                            class="animate-pulse bg-gray-200 dark:bg-gray-700 w-full h-full absolute flex items-center justify-center"
                        >
                            <svg
                                class="size-20 animate-spin text-primary animate-pulse"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    class="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    stroke-width="4"
                                ></circle>
                                <path
                                    class="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
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
                    <div
                        v-if="errorUploadImage"
                        class="bg-red-500 text-white rounded-xl px-4 py-2 dark:bg-red-900 dark:text-white/50 mt-4"
                    >
                        {{ errorUploadImage }}
                    </div>
                </transition>
            </div>
            <div>
                <form
                    @submit.prevent=""
                    novalidate
                >
                    <div class="space-y-4">
                        <div>
                            <label
                                for="user-name"
                                class="block text-gray-400 dark:text-white/35"
                            >
                                Your username
                            </label>
                            <input
                                type="text"
                                id="user-name"
                                placeholder="Enter user name..."
                                class="px-4 py-3 rounded-xl border-2 border-gray-300 w-full focus:outline-0 focus:border-primary transition-colors duration-600 text-gray-500 dark:text-white/75 dark:border-gray-500"
                            >
                        </div>
                        <div>
                            <label
                                for="email"
                                class="flex text-gray-400 dark:text-white/35 justify-between items-end"
                            >
                                Your email <small>Cannot be changed</small>
                            </label>
                            <input
                                type="email"
                                id="email"
                                placeholder="Enter email..."
                                class="px-4 py-3 rounded-xl border-2 border-gray-300 w-full read-only:cursor-not-allowed focus:outline-0 read-only:opacity-50 text-gray-500 dark:text-white/75 dark:border-gray-500"
                                readonly
                                v-model="emailValue"
                            >
                        </div>
                    </div>
                    <base-button class="mt-8">
                        Save
                    </base-button>

                    <hr class="border-gray-300 dark:border-gray-800 my-6" />
                    <button
                        type="button"
                        class=""
                    >
                        Delete account
                    </button>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>

import BasePageTitle from '../../components/Base/BasePageTitle.vue';
import BaseButton from '../../components/Base/BaseButton.vue';
import { computed, ref, watch, watchEffect } from 'vue';
import { useAuthStore } from '../../stores/useAuthStore';
import { storeToRefs } from 'pinia';
import { useStorage } from '../../composables/useStorage';
import { updateProfile } from 'firebase/auth';
import { auth } from '../../firebase/config';

const {
    user
} = storeToRefs(useAuthStore())


const {
    error: errorUploadImage,
    url,
    filePath,
    isPending: isPendingUpload,
    uploadImage
} = useStorage()

const userAvatarURL = computed(() => {
    return user.value?.photoURL || 'https://via.placeholder.com/200?text=No+Avatar'
})

const emailValue = user.value?.email;

const form = ref({
    displayName: user.value.displayName || '',
})

const handleFile = async (e) => {
    const selectedFile = e.target.files[0];

    // need to also add the js extension filter
    if (selectedFile) {
        const success = await uploadImage('avatars', user.value, selectedFile)

        // need to delete the old image here 

        if (success && auth.currentUser) {

            await updateProfile(auth.currentUser, {
                photoURL: url.value,
            })

            user.value.photoURL = url.value
        }

    }
}

</script>

<style lang="scss" scoped></style>