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
                    position="absolute"
                    class="bg-white/80 dark:bg-gray-900/80 z-1"
                >
                    {{ !isPendingRecognizePlant ? loadingTitle : 'Recognizing plant...' }}
                </base-loader>
                <Alert
                    v-else-if="error"
                    variant="destructive"
                    class="mb-6"
                >
                    <AlertCircleIcon />
                    <AlertDescription>
                        {{ error }}
                    </AlertDescription>
                </Alert>
            </transition>
            <form
                @submit.prevent="submitForm"
                novalidate
            >
                <div class="space-y-4">
                    <base-input-wrapper-authed
                        field-label="Image"
                        field-id="plant-image"
                    >
                        <base-upload-button
                            input-id="plant-image"
                            :existing-image-src="existingImageSrc"
                            @send-file="handleFile"
                            @remove-file="handleRemoveFile"
                        />
                    </base-input-wrapper-authed>
                    <transition name="fade">
                        <div
                            v-if="isAISuggestionBoxShown"
                            class="border-2 border-primary-500 rounded-xl p-4 md:flex md:gap-4 md:items-center md:justify-between"
                        >
                            <div class="flex gap-2 items-center mb-4 md:mb-0">
                                <span class="material-symbols-outlined text-3xl text-gray-500">
                                    smart_toy
                                </span>
                                <p class="text-gray-500 leading-4">
                                    Use AI to fill the fields for you?<br />
                                    <small class="text-gray-400">(Existing data will be replaced)</small>
                                </p>
                            </div>
                            <div class="flex gap-2 justify-center md:justify-end">
                                <Button
                                    v-tooltip="{
                                        content: 'The information may not be accurate. Use at your own risk.',
                                        container: 'body',
                                    }"
                                    type="button"
                                    variant="hover-outline"
                                    size="sm"
                                    @click="handleRecognizePlant"
                                >
                                    <span class="material-symbols-outlined text-lg">
                                        done
                                    </span>
                                    Yes
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    class="inline-flex align-top gap-1 items-center min-w-[70px] justify-center"
                                    @click="isAISuggestionBoxShown = false"
                                >
                                    <span class="material-symbols-outlined text-lg">
                                        close
                                    </span>
                                    No
                                </Button>
                            </div>
                        </div>
                    </transition>
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
                            <label class="inline-flex items-center cursor-pointer">

                                <Switch>
                                    <input
                                        type="checkbox"
                                        id="plant-wateredNow"
                                        v-model="form.wateredNow"
                                        @input="formErrors.wateredNow = null"
                                        value="true"
                                        class="sr-only peer"
                                    >
                                </Switch>
                                <!-- <div class="relative w-10 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:absolute after:top-[4px] after:start-[4px] after:bg-white dark:after:bg-gray-900 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary dark:peer-checked:bg-primary-800"></div> -->
                                <span class="ms-3">
                                    I've watered the plant today
                                </span>
                            </label>

                        </div>
                    </base-input-wrapper-authed>
                </div>
                <Button
                    class="mt-8 w-full"
                    :class="{ 'animate-pulse': isPending }"
                    size="lg"
                    variant="hover-outline"
                    :disabled="isPending"
                >
                    {{ buttonLabel }}
                </Button>
            </form>
        </div>
    </base-modal-content>
</template>

<script setup>

import { computed, ref, watch, watchEffect } from 'vue';

import BaseInput from '@/components/base/BaseForm/BaseInput.vue';
import BaseInputWrapperAuthed from '@/components/base/BaseForm/BaseInputWrapperAuthed.vue';
import BaseTextarea from '@/components/base/BaseForm/BaseTextarea.vue';
import BaseUploadButton from '@/components/base/BaseForm/BaseUploadButton.vue';
import BaseLoader from '@/components/base/BaseLoader.vue';
import BaseModalContent from '@/components/base/BaseModal/BaseModalContent.vue';

import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

import {
    Alert,
    AlertDescription
} from '@/components/ui/alert';

import { AlertCircleIcon } from 'lucide-vue-next';

import { useGetDetails, useRecognizePlant, useSendData, useStorage, useUpdateData } from '@/composables';
import { useAuthStore } from '@/stores/useAuthStore';
import { useScrollStore } from '@/stores/useScrollStore';
import { useUIStore } from '@/stores/useUIStore';
import { addLog, resizeImageBitmap } from '@/utils';
import { getBlob, getStorage, ref as storageRef } from "firebase/storage";


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
const uiStore = useUIStore()
const scrollStore = useScrollStore()

const localPlantId = props.plantId
const localRoomId = props.roomId

const {
    error: errorSendData,
    isPending: isPendingSendData,
    sendData,
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
    error: errorUpdate,
    isPending: isPendingUpdate,
    updateData,
} = useUpdateData()

const {
    error: errorPlant,
    isPending: isPendingPlant,
    data: detailsPlant,
} = useGetDetails(`rooms/${localRoomId}/plants/${localPlantId}`)


const {
    error: errorRecognizePlant,
    isPending: isPendingRecognizePlant,
    identifyPlantWithGemini,
} = useRecognizePlant()

const error = computed(() => errorSendData.value || errorUpload.value || errorPlant.value || errorRecognizePlant.value)
const isPending = computed(() => isPendingSendData.value || isPendingUpload.value || isPendingUpdate.value || isPendingRecognizePlant.value)

const form = ref({
    name: '',
    desc: '',
    file: null,
    watering: 3,
    ...(!localPlantId && { wateredNow: false })
})

const existingImageSrc = ref('')

let oldImageUrl = null;
let isInitialImageUrlSet = false;

let areOriginalFieldsLoaded = false
let originalData = {}

const isAISuggestionBoxShown = ref(false)

const handleFile = (file) => {
    existingImageSrc.value = null
    form.value.file = file;
    isAISuggestionBoxShown.value = true
}

const handleRemoveFile = ({ toDefault }) => {
    form.value.file = null;


    if (!toDefault) {
        isAISuggestionBoxShown.value = false

        if (oldImageUrl) {
            existingImageSrc.value = oldImageUrl;
            isAISuggestionBoxShown.value = true
        }
    } else {
        existingImageSrc.value = null;
        isAISuggestionBoxShown.value = false
    }
}

watch(detailsPlant, (newVal) => {
    if (newVal) {
        form.value.name = newVal.name || '';
        form.value.desc = newVal.desc || '';
        form.value.watering = newVal.wateringFrequency || 3;
        form.value.wateredNow = newVal.wateredNow || false;
        existingImageSrc.value = newVal.imgSrc

        if (newVal.imgSrc) {
            isAISuggestionBoxShown.value = true
        }

        if (!isInitialImageUrlSet) {
            oldImageUrl = !!newVal.imgSrc ? newVal.imgSrc : null;
            isInitialImageUrlSet = true;
        }

        if (!areOriginalFieldsLoaded) {
            originalData = {
                name: newVal.name,
                imageSrc: newVal.imgSrc,
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
        ...(!localPlantId && { wateredNow: !!form.value.wateredNow })
    }

    if (localPlantId && !form.value.file && !existingImageSrc.value && oldImageUrl) {
        data.imgSrc = null;

        addLog(log, 'image', oldImageUrl, null)
    }

    if (localPlantId) {
        addLog(log, 'name', originalData.name, data.name)
        addLog(log, 'image', originalData.imgSrc, data.imgSrc)
        addLog(log, 'description', originalData.desc, data.desc)
    }

    if (form.value.file) {
        const resizedFile = await resizeImageBitmap(form.value.file, 400, 400)

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
        success = await sendData('plants', data, localRoomId)
    } else {
        success = await updateData(data, `rooms/${localRoomId}/plants/${localPlantId}`)
    }

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

        uiStore.closeModal()
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

const extractStoragePath = (downloadUrl) => {
    const url = new URL(downloadUrl);
    return decodeURIComponent(url.pathname.split("/o/")[1]);
};

const handleRecognizePlant = async () => {
    let fileToProcess = form.value.file;

    if (!fileToProcess && existingImageSrc.value) {
        try {
            const storage = getStorage();
            const path = extractStoragePath(existingImageSrc.value);
            if (!path) throw new Error("Invalid Firebase URL");

            const imageRef = storageRef(storage, path);
            const blob = await getBlob(imageRef);

            fileToProcess = new File([blob], "plant.jpg", { type: blob.type });
        } catch (e) {
            console.error('Failed to fetch existing image:', e);
            return;
        }
    }

    if (!fileToProcess) return;

    const data = await identifyPlantWithGemini(fileToProcess, 'image/jpeg');
    if (!data) return;

    form.value.name = data.name;
    form.value.desc = data.desc;
    form.value.watering = data.wateringFrequency;
    isAISuggestionBoxShown.value = false;
};

</script>

<style lang="scss" scoped></style>