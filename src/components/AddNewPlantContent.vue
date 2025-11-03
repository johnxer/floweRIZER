<template>
    <base-modal-content>
        <template #modalTitle>
            Create new plant
        </template>
        <div class="relative">

            <transition
                name="fade"
                mode="out-in"
            >
                <base-loader
                    v-if="isPending"
                    position-type="absolute"
                    class="bg-white/80 dark:bg-gray-800/80 z-1"
                />
            </transition>
            <form
                @submit.prevent="submitForm"
                novalidate
            >

                <div class="space-y-4">
                    <base-input-wrapper-authed
                        field-label="Name"
                        field-id="plant-name"
                        :errorText="formErrors.name"
                    >
                        <input
                            type="text"
                            id="plant-name"
                            placeholder="Enter plant name..."
                            class="px-4 py-2 rounded-xl border-2 w-full focus:outline-0 focus:border-primary transition-colors duration-600 text-gray-500 dark:text-white/75"
                            :class="!formErrors.name ? 'border-gray-300 dark:border-gray-500' : 'border-red-300 dark:border-red-900'"
                            v-model.trim="form.name"
                            @input="formErrors.name = null"
                        >
                    </base-input-wrapper-authed>
                    <base-input-wrapper-authed
                        field-label="Image"
                        field-id="plant-image"
                    >
                        <div class="flex gap-2 items-center">
                            <label
                                for="plant-image"
                                class="relative border border-2 cursor-pointer transition-all duration-600 disabled:cursor-not-allowed px-2 py-2 text-base rounded-xl cursor-pointer bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-transparent hover:text-gray-400 disabled:bg-gray-500/50 disabled:border-gray-500/0 disabled:hover:text-white inline-block overflow-hidden"
                            >
                                Upload file
                                <input
                                    id="plant-image"
                                    type="file"
                                    class="hidden"
                                    accept="image/png, image/jpeg, image/jpg, image/gif"
                                    @change="handleFile"
                                >
                            </label>
                            <div
                                v-if="selectFileName"
                                class="text-sm text-gray-500 inline-flex align-top gap-1 items-center"
                            >
                                <span class="material-symbols-outlined text-2xl">
                                    image
                                </span>
                                {{ selectFileName }}

                            </div>
                        </div>
                    </base-input-wrapper-authed>
                    <base-input-wrapper-authed
                        field-label="Description"
                        field-id="plant-description"
                    >
                        <textarea
                            id="room-description"
                            placeholder="Enter room description..."
                            class="px-4 py-2 rounded-xl border-2 border-gray-300 w-full read-only:cursor-not-allowed focus:outline-0 read-only:opacity-50 text-gray-500 dark:text-white/75 dark:border-gray-500 h-[100px]"
                            v-model.trim="form.desc"
                        />
                    </base-input-wrapper-authed>
                    <base-input-wrapper-authed
                        field-id="plant-watering"
                        :errorText="formErrors.watering"
                    >
                        <div class="flex gap-2 items-center text-gray-500">
                            Needs water every
                            <input
                                type="number"
                                id="plant-watering"
                                value="7"
                                placeholder="..."
                                class="px-4 py-2 rounded-xl border-2 focus:outline-0 focus:border-primary transition-colors duration-600 text-gray-500 dark:text-white/75 w-[80px]"
                                :class="!formErrors.watering ? 'border-gray-300 dark:border-gray-500' : 'border-red-300 dark:border-red-900'"
                                v-model.trim="form.watering"
                                @input="formErrors.watering = null"
                                min="1"
                            >
                            days
                        </div>
                    </base-input-wrapper-authed>
                    <base-input-wrapper-authed
                        field-id="plant-wateredNow"
                        :errorText="formErrors.wateredNow"
                    >
                        <div class="flex gap-2 items-center text-gray-500">
                            <!-- tohle bude custom toggle -->
                            <label class="inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    id="plant-wateredNow"
                                    v-model.trim="form.wateredNow"
                                    @input="formErrors.wateredNow = null"
                                    value="true"
                                    class="sr-only peer"
                                >
                                <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary dark:peer-checked:bg-primary"></div>
                                <span class="ms-3">
                                    I've watered the plant today
                                </span>
                            </label>

                        </div>
                    </base-input-wrapper-authed>
                </div>
                <base-button
                    class="mt-8"
                    :class="{ 'animate-pulse': isPending }"
                    btn-style="notRounded"
                    btn-size="base"
                    :disabled="isPending"
                >
                    Create
                </base-button>
            </form>
        </div>
    </base-modal-content>
</template>

<script setup>

import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import { useSendData } from '../composables/useSendData';
import { useStorage } from '../composables/useStorage';
import { useAuthStore } from '../stores/useAuthStore';
import BaseButton from './Base/BaseButton.vue';
import BaseInputWrapperAuthed from './Base/BaseInputWrapperAuthed.vue';
import BaseLoader from './Base/BaseLoader.vue';
import BaseModalContent from './Base/BaseModal/BaseModalContent.vue';

const props = defineProps({
    roomId: {
        type: String,
        required: true,
    }
})

const {
    user
} = storeToRefs(useAuthStore())

const {
    error: errorSendData,
    isPending: isPendingSendData,
    sendDataPlants
} = useSendData()

const {
    error: errorUpload,
    url,
    filePath,
    isPending: isPendingUpload,
    uploadImage,
} = useStorage()


// const error = computed(() => errorSendData.value || errorUpload.value)
const isPending = computed(() => isPendingSendData.value || isPendingUpload.value)

const form = ref({
    name: '',
    desc: '',
    file: null,
    watering: 3,
    wateredNow: false
})

const formErrors = ref({})

const allowedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']

const selectFileName = ref(null)

const handleFile = (e) => {
    form.value.file = e.target.files[0];

    selectFileName.value = form.value.file.name

    if (!selectFileName.value || !allowedFormats.includes(selectFileName.value.type)) return

}

const validateForm = () => {
    formErrors.value = {}

    if (!form.value.name) {
        formErrors.value.name = "Plant's name cannot be empty"
    }

    if (!form.value.watering || form.value.watering === 0) {
        formErrors.value.watering = "Watrering frequency cannot be empty or 0 days"
    }

    return Object.keys(formErrors.value).length === 0
}

const clearForm = () => {
    form.value.name = ''
    form.value.file = null
    form.value.desc = ''
}

const emit = defineEmits(['close-modal'])

const data = ref({});


const submitForm = async () => {
    if (!validateForm()) return

    console.log(user.value)
    console.log(`${props.roomId}/${form.value.file}`)



    data.value = {
        name: form.value.name,
        desc: form.value.desc,
        wateringFrequency: form.value.watering,
        wateredNow: form.value.wateredNow
    }


    if (form.value.file) {
        const uploadSuccess = await uploadImage('plants', user.value, form.value.file)

        if (uploadSuccess) {

            data.value = {
                ...data.value,
                imgSrc: url.value,
            }
        }
    }

    const success = await sendDataPlants(data.value, props.roomId)

    if (success) {
        clearForm()

        emit('close-modal')
    }
}



</script>

<style lang="scss" scoped></style>