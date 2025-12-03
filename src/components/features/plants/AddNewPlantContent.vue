<template>
    <base-modal-content>
        <template #modalTitle>
            <span class="noto-color-emoji-regular mr-2">🌱</span>
            {{ modalTitle }}
        </template>
        <div class="relative">
            <transition
                name="fade"
                mode="out-in"
            >
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
                    <span class="material-symbols-outlined">
                        error
                    </span>
                    <AlertDescription>
                        {{ error }}
                    </AlertDescription>
                </Alert>
            </transition>
            <form
                @submit.prevent="onSubmitForm"
                novalidate
            >
                <FieldGroup>
                    <FormField
                        v-slot="{ componentField }"
                        name="file"
                    >
                        <FormItem>
                            <FormLabel>
                                Image
                            </FormLabel>
                            <FormControl>
                                <base-upload-button
                                    input-id="plant-image"
                                    :existing-image-src="existingImageSrc"
                                    @send-file="(file) => {
                                        handleFile(file);
                                        componentField.onChange(file);
                                    }"
                                    @remove-file="(args) => {
                                        handleRemoveFile(args);
                                        componentField.onChange(null);
                                    }"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>

                    <transition name="fade">
                        <div
                            v-if="isAISuggestionBoxShown"
                            class="border-2 border-primary-500 rounded-xl p-4 md:flex md:gap-4 md:items-center md:justify-between"
                        >
                            <div class="flex gap-2 items-center mb-4 md:mb-0">
                                <span class="material-symbols-outlined text-3xl text-gray-500 dark:text-neutral-500 w-8">
                                    smart_toy
                                </span>
                                <p class="text-gray-500 dark:text-neutral-500 leading-5">
                                    Use AI to fill the fields?<br />
                                    <small class="text-gray-400 dark:text-neutral-600">(Existing data will be replaced)</small>
                                </p>
                            </div>
                            <div class="grid grid-cols-2 md:flex gap-4 justify-center md:justify-end pl-10 md:pl-0">
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

                    <FormField
                        v-slot="{ componentField }"
                        name="name"
                    >
                        <FormItem>
                            <FormLabel>
                                Name
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    placeholder="Enter plant name..."
                                    v-bind="componentField"
                                    max-length="30"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>

                    <FormField
                        v-slot="{ componentField }"
                        name="desc"
                    >
                        <FormItem>
                            <FormLabel>
                                Description
                            </FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Enter plant description..."
                                    class="resize-none"
                                    v-bind="componentField"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                    <FormField
                        v-slot="{ componentField }"
                        name="lightRequirements"
                    >
                        <FormItem>
                            <FormLabel>
                                Light requirements
                            </FormLabel>
                            <FormControl>
                                <div class="grid grid-cols-3 gap-2">
                                    <base-button-select
                                        v-for="icon in plantsStore.lightIcons"
                                        :key="icon.icon"
                                        :value="icon.icon"
                                        :label="icon.label"
                                        @click="componentField.onChange(icon.label.toLowerCase())"
                                        :selected="componentField.modelValue === icon.label.toLowerCase()"
                                        :icon="icon"
                                    />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                    <FormField
                        v-slot="{ componentField }"
                        name="watering"
                    >
                        <FormItem>
                            <FormControl>
                                <FormLabel class="flex gap-2 items-center">
                                    Needs water every
                                    <Input
                                        type="number"
                                        placeholder="..."
                                        v-bind="componentField"
                                        max-length="3"
                                        class="w-[80px]"
                                        min="1"
                                    />
                                    days
                                </FormLabel>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>

                    <div
                        v-if="!localPlantId"
                        class="bg-gray-50 dark:bg-neutral-800/20 p-4 rounded-xl"
                    >
                        <FormField
                            v-slot="{ value, handleChange }"
                            name="wateredNow"
                        >
                            <FormItem>
                                <FormControl>
                                    <FormLabel class="flex gap-2 items-center">
                                        <Switch
                                            id="plant-wateredNow"
                                            :model-value="value"
                                            @update:model-value="handleChange"
                                        />
                                        <span class="ms-3">
                                            I've watered the plant today
                                        </span>
                                    </FormLabel>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>
                    </div>
                    <Button
                        class="w-full"
                        :class="{ 'animate-pulse': isPending }"
                        size="lg"
                        variant="hover-outline"
                        :disabled="isPending"
                    >
                        {{ buttonLabel }}
                    </Button>
                </FieldGroup>


            </form>
        </div>
    </base-modal-content>
</template>

<script setup>
import { computed, ref, watch, watchEffect } from 'vue';

import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import * as z from 'zod';

import BaseButtonSelect from '@/components/base/BaseForm/BaseButtonSelect.vue';
import BaseUploadButton from '@/components/base/BaseForm/BaseUploadButton.vue';
import BaseLoader from '@/components/base/BaseLoader.vue';
import BaseModalContent from '@/components/base/BaseModal/BaseModalContent.vue';

import { Button } from '@/components/ui/button';

import { Switch } from '@/components/ui/switch';

import {
    FieldGroup
} from '@/components/ui/field';

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';

import {
    Alert,
    AlertDescription
} from '@/components/ui/alert';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import { useGetDetails, useRecognizePlant, useSendData, useStorage, useUpdateData } from '@/composables';

import { useAuthStore } from '@/stores/useAuthStore';
import { usePlantsStore } from '@/stores/usePlantsStore';
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
const plantsStore = usePlantsStore()
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

const existingImageSrc = ref('')

let oldImageUrl = null;
let isInitialImageUrlSet = false;

let areOriginalFieldsLoaded = false
let originalData = {}

const isAISuggestionBoxShown = ref(false)

const handleFile = (file) => {
    existingImageSrc.value = null
    isAISuggestionBoxShown.value = true
}

const handleRemoveFile = ({ toDefault }) => {

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

const formSchema = toTypedSchema(z.object({
    name: z.string()
        .min(1, { message: 'Name is required.' }),
    desc: z.string().optional(),
    watering: z.number()
        .min(1, { message: 'Watering frequency is required.' })
        .max(365, { message: 'Watering frequency is too high.' }),
    file: z.any().optional(),
    lightRequirements: z.string().optional(),
    wateredNow: z.boolean().optional(),
}))

const { handleSubmit, setValues, resetForm, values } = useForm({
    validationSchema: formSchema,
    initialValues: {
        name: '',
        desc: '',
        watering: 3,
        file: null,
        wateredNow: false,
        lightRequirements: '',
    },
})



watch(detailsPlant, (newVal) => {
    if (newVal) {
        setValues({
            name: newVal.name || '',
            desc: newVal.desc || '',
            watering: newVal.wateringFrequency || 3,
            wateredNow: newVal.wateredNow || false,
            lightRequirements: newVal.lightRequirements || '',
        });
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
                desc: newVal.desc,
                watering: newVal.watering,
                lightRequirements: newVal.lightRequirements,
            }

            areOriginalFieldsLoaded = true;
        }
    }
}, { immediate: true })

const formErrors = ref({})

const clearForm = () => {
    resetForm()
}

const emit = defineEmits(['close-modal', 'is-pending'])

watchEffect(() => {
    emit('is-pending', isPending.value)
})

const onSubmitForm = handleSubmit(async (values) => {

    let log = []

    if (values.wateredNow) {
        log = [
            {
                id: crypto.randomUUID(),
                action: 'watered',
                date: new Date().toISOString(),
            },
        ]
    }

    const data = {
        name: values.name,
        desc: values.desc,
        wateringFrequency: values.watering,
        lightRequirements: values.lightRequirements || null,
        ...(!localPlantId && { wateredNow: values.wateredNow })
    }

    console.log(data)

    if (localPlantId && !values.file && !existingImageSrc.value && oldImageUrl) {
        data.imgSrc = null;

        addLog(log, 'image', oldImageUrl, null)
    }

    if (localPlantId) {
        addLog(log, 'name', originalData.name, data.name)
        addLog(log, 'image', originalData.imgSrc, data.imgSrc)
        addLog(log, 'description', originalData.desc, data.desc)
        addLog(log, 'watering', originalData.watering, data.watering)
        addLog(log, 'light requirements', originalData.lightRequirements, data.lightRequirements)
    }

    if (values.file) {
        const resizedFile = await resizeImageBitmap(values.file, 400, 400)

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
})

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
    let fileToProcess = values.file;

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

    try {
        const data = await identifyPlantWithGemini(fileToProcess, 'image/jpeg');
        if (!data) return;

        console.log('ai data', data)

        setValues({
            name: data.name,
            desc: data.desc,
            watering: data.wateringFrequency,
            lightRequirements: data.lightRequirements,
        });
        isAISuggestionBoxShown.value = false;
    } catch (e) {
        console.error('Plant recognition failed:', e);
    }
};

</script>

<style lang="scss" scoped></style>