<template>
    <base-modal-content>
        <template #modalTitle>
            <span class="noto-color-emoji-regular mr-2">🌱</span>
            {{ modalTitle }}
        </template>
        <div class="relative">
            <transition name="fade">
                <base-loader
                    v-if="isPending"
                    position-type="absolute"
                    class="bg-white/80 dark:bg-gray-900/80 z-1"
                >
                    {{ loadingTitle }}
                </base-loader>
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
                        <base-input
                            input-id="plant-name"
                            input-placeholder="Enter plant name..."
                            class="w-full"
                            :input-error="formErrors.name"
                            v-model.trim="form.name"
                            @input="formErrors.name = null"
                        />
                    </base-input-wrapper-authed>
                    <base-input-wrapper-authed
                        field-label="Image"
                        field-id="plant-image"
                    >
                        <base-upload-button
                            input-id="plant-image"
                            :existing-image-src="existingImageSrc"
                            @send-file="handleFile"
                        />
                    </base-input-wrapper-authed>
                    <base-input-wrapper-authed
                        field-label="Description"
                        field-id="plant-description"
                    >
                        <base-textarea
                            textarea-id="plant-description"
                            textarea-placeholder="Enter plant description..."
                            v-model.trim="form.desc"
                        />
                    </base-input-wrapper-authed>
                    <base-input-wrapper-authed
                        field-id="plant-watering"
                        :errorText="formErrors.watering"
                    >
                        <div class="flex gap-2 items-center text-gray-500">
                            Needs water every
                            <base-input
                                input-type="number"
                                input-id="plant-watering"
                                input-placeholder="..."
                                class="w-[80px]"
                                v-model.trim="form.watering"
                                :error="!!formErrors.watering"
                                @input="formErrors.watering = null"
                                min="1"
                            />
                            days
                        </div>
                    </base-input-wrapper-authed>
                    <base-input-wrapper-authed
                        v-if="!localPlantId"
                        field-id="plant-wateredNow"
                        :errorText="formErrors.wateredNow"
                    >
                        <div class="flex gap-2 items-center text-gray-500">
                            <!-- tohle bude custom toggle -->
                            <label class="inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    id="plant-wateredNow"
                                    v-model="form.wateredNow"
                                    @input="formErrors.wateredNow = null"
                                    value="true"
                                    class="sr-only peer"
                                >
                                <div class="relative w-10 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:absolute after:top-[4px] after:start-[4px] after:bg-white dark:after:bg-gray-900 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary dark:peer-checked:bg-primary-800"></div>
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
                    btn-style="notRoundedMd"
                    btn-size="base"
                    :disabled="isPending"
                >
                    {{ buttonLabel }}
                </base-button>
            </form>
        </div>
    </base-modal-content>
</template>

<script setup>

import { computed, ref, watch, watchEffect } from 'vue';
import { useSendData } from '../composables/useSendData';
import { useStorage } from '../composables/useStorage';
import { useAuthStore } from '../stores/useAuthStore';

import BaseButton from './Base/BaseButtons/BaseButton.vue';
import BaseInput from './Base/BaseForm/BaseInput.vue';
import BaseTextarea from './Base/BaseForm/BaseTextarea.vue';
import BaseUploadButton from './Base/BaseForm/BaseUploadButton.vue';

import { useGetDetails } from '../composables/useGetDetail';
import { usePlantsStore } from '../stores/usePlantsStore';
import { useScrollStore } from '../stores/useScrollStore';
import { addLog } from '../utils/addLog';
import { resizeImageBitmap } from '../utils/imageResize';
import BaseInputWrapperAuthed from './Base/BaseForm/BaseInputWrapperAuthed.vue';
import BaseLoader from './Base/BaseLoader.vue';
import BaseModalContent from './Base/BaseModal/BaseModalContent.vue';

const props = defineProps({
    roomId: {
        type: [String, null],
        required: true,
    },
    plantId: {
        type: String,
        required: false,
    }
})

const authStore = useAuthStore()
const plantsStore = usePlantsStore()
const scrollStore = useScrollStore()

const localPlantId = props.plantId
const localRoomId = props.roomId

const {
    error: errorSendData,
    isPending: isPendingSendData,
    sendDataPlants,
    updateDataPlants
} = useSendData()

const {
    error: errorUpload,
    url,
    filePath,
    isPending: isPendingUpload,
    uploadImage,
    deleteImageByUrl
} = useStorage()


const {
    error: errorPlant,
    isPending: isPendingPlant,
    details: detailsPlant,
} = useGetDetails(`rooms/${localRoomId}/plants/${localPlantId}`)


// const error = computed(() => errorSendData.value || errorUpload.value)
const isPending = computed(() => isPendingSendData.value || isPendingUpload.value)

const form = ref({
    name: '',
    desc: '',
    file: null,
    watering: 3,
    wateredNow: false
})

const existingImageSrc = ref('')

let oldImageUrl = null;
let isInitialImageUrlSet = false;

let areOriginalFieldsLoaded = false
let originalData = {}

const handleFile = (file) => {
    existingImageSrc.value = null
    form.value.file = file;
}

watch(detailsPlant, (newVal) => {
    if (newVal) {
        form.value.name = newVal.name || '';
        form.value.desc = newVal.desc || '';
        form.value.watering = newVal.wateringFrequency || 3;
        form.value.wateredNow = newVal.wateredNow || false;
        existingImageSrc.value = newVal.imgSrc

        if (!isInitialImageUrlSet) {
            oldImageUrl = !!newVal.imgSrc ? newVal.imgSrc : null;
            isInitialImageUrlSet = true;
        }

        if (!areOriginalFieldsLoaded) {
            originalData = {
                name: newVal.name,
                icon: newVal.icon,
                desc: newVal.desc
            }

            areOriginalFieldsLoaded = true;
        }
    }
}, { immediate: true })

const formErrors = ref({})

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

const emit = defineEmits(['close-modal', 'is-pending'])

watchEffect(() => {
    emit('is-pending', isPending.value)
})

const submitForm = async () => {
    if (!validateForm()) return

    let log = []

    if (form.value.wateredNow) {
        log = [
            {
                id: crypto.randomUUID(),
                action: 'watered',
                date: new Date().toISOString(),
            },
        ]
    }

    const data = {
        name: form.value.name,
        desc: form.value.desc,
        wateringFrequency: form.value.watering,
        wateredNow: !!form.value.wateredNow,
    }

    if (localPlantId) {
        addLog(log, 'name', originalData.name, data.name)
        addLog(log, 'icon', originalData.icon, data.icon)
        addLog(log, 'description', originalData.desc, data.desc)
    }

    if (form.value.file) {
        const resizedFile = await resizeImageBitmap(form.value.file, 400, 400, 0.8)

        const uploadSuccess = await uploadImage('plants', authStore.user, resizedFile)

        if (uploadSuccess) {
            data.imgSrc = url.value;

            if (localPlantId) {
                addLog(log, 'image', oldImageUrl, url.value)
            }
        }
    }

    if (localPlantId) {
        const existingLog = detailsPlant.value?.log || [];
        data.log = [
            ...existingLog,
            ...log
        ];
    } else {
        data.log = log;
    }


    let success = false;

    if (!localPlantId) {
        success = await sendDataPlants(data, localRoomId)
    } else {
        success = await updateDataPlants(data, localRoomId, localPlantId)
    }

    console.log(success);

    if (!!success) {
        if (oldImageUrl !== existingImageSrc.value) {
            await deleteImageByUrl(oldImageUrl)
        }

        clearForm()

        if (!localPlantId) {
            scrollStore.setScrollTarget({
                type: 'plant',
                plantId: success
            })
        }

        plantsStore.closePlantModal()
        emit('close-modal', false)
    }
}

const modalTitle = computed(() => `${localPlantId ? 'Edit' : 'Add'} plant`)

const loadingTitle = computed(() => `${localPlantId ? 'Updating' : 'Creating'} plant...`)

const buttonLabel = computed(() => {
    if (isPending.value) {
        return `${localPlantId ? 'Updating' : 'Adding'} plant...`
    } else {
        return `${localPlantId ? 'Update' : 'Add'} plant`
    }
})

</script>

<style lang="scss" scoped></style>