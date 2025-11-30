<template>
    <base-modal-content>
        <template #modalTitle>
            <span class="noto-color-emoji-regular mr-2">🏠</span>{{ modalTitle }}
        </template>
        <div class="relative">
            <transition name="fade">
                <base-loader
                    v-if="isPending"
                    position="absolute"
                    :has-bg="true"
                >
                    {{ loadingTitle }}
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
            <div>
                <div>
                    <form
                        @submit.prevent="onSubmitForm"
                        novalidate
                    >
                        <FieldGroup>
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
                                            placeholder="Enter room name..."
                                            v-bind="componentField"
                                            max-length="30"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            </FormField>
                            <FormField
                                v-slot="{ componentField }"
                                name="icon"
                            >
                                <FormItem>
                                    <FormLabel>
                                        Icon
                                    </FormLabel>
                                    <FormControl>
                                        <div class="grid grid-cols-3 md:grid-cols-4 gap-2">
                                            <button
                                                v-for="icon in roomsStore.roomIcons"
                                                :key="icon.icon"
                                                type="button"
                                                @click="componentField.onChange(icon.icon)"
                                                class="flex flex-col items-center justify-center p-2 rounded-lg border-2 transition-all duration-600 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                                                :class="[
                                                    componentField.modelValue === icon.icon
                                                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600'
                                                        : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400'
                                                ]"
                                            >
                                                <span class="material-symbols-outlined text-2xl mb-1">
                                                    {{ icon.icon }}
                                                </span>
                                                <span class="text-xs text-center truncate w-full">
                                                    {{ icon.label }}
                                                </span>
                                            </button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            </FormField>
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
                                            input-id="room-image"
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
                                            placeholder="Enter room description..."
                                            class="resize-none"
                                            v-bind="componentField"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            </FormField>
                        </FieldGroup>

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
            </div>
        </div>
    </base-modal-content>
</template>

<script setup>
import { computed, ref, watch, watchEffect } from 'vue';

import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import * as z from 'zod';

import BaseUploadButton from '@/components/base/BaseForm/BaseUploadButton.vue';
import BaseLoader from '@/components/base/BaseLoader.vue';
import BaseModalContent from '@/components/base/BaseModal/BaseModalContent.vue';

import { Button } from '@/components/ui/button';

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

import { useAuthStore } from '@/stores/useAuthStore';
import { useRoomsStore } from '@/stores/useRoomsStore';
import { useScrollStore } from '@/stores/useScrollStore';
import { useUIStore } from '@/stores/useUIStore';

import { useGetDetails, useSendData, useStorage, useUpdateData } from '@/composables';

import { addLog, resizeImageBitmap } from '@/utils';

const props = defineProps({
    roomId: {
        type: String,
        required: false,
        default: null
    },
})

const localRoomId = props.roomId

const authStore = useAuthStore()
const roomsStore = useRoomsStore()
const uiStore = useUIStore()

const {
    error: errorSendData,
    isPending: isPendingSendData,
    sendData
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


let errorRoom, isPendingRoom, detailsRoom

if (localRoomId) {
    ({
        error: errorRoom,
        isPending: isPendingRoom,
        data: detailsRoom,
    } = useGetDetails(`rooms/${localRoomId}`))
} else {
    errorRoom = ref(null)
    isPendingRoom = ref(false)
    detailsRoom = ref(null)
}

const error = computed(() => errorSendData.value || errorUpload.value || errorUpdate.value)
const isPending = computed(() => isPendingRoom.value || isPendingSendData.value || isPendingUpload.value || isPendingUpdate.value)

const existingImageSrc = ref('')

let oldImageUrl = null;
let isInitialImageUrlSet = false;

let areOriginalFieldsLoaded = false
let originalData = {}

const handleFile = (file) => {
    existingImageSrc.value = null
}

const handleRemoveFile = ({ toDefault }) => {
    console.log('toDefault', toDefault)

    if (!toDefault) {

        if (oldImageUrl) {
            existingImageSrc.value = oldImageUrl;
        }
    } else {
        existingImageSrc.value = null;
    }
}

const formSchema = toTypedSchema(z.object({
    name: z.string()
        .min(1, { message: 'Name is required.' }),
    icon: z.string()
        .min(1, { message: 'Icon is required.' }),
    desc: z.string().optional(),
    file: z.any().optional(),
}))

const { handleSubmit, setValues, resetForm } = useForm({
    validationSchema: formSchema,
    initialValues: {
        name: '',
        icon: '',
        desc: '',
    },
})

watch(detailsRoom, (newVal) => {
    if (newVal) {
        setValues({
            name: newVal.name || '',
            icon: newVal.icon || '',
            desc: newVal.desc || ''
        })


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

const modalTitle = computed(() => `${localRoomId ? 'Edit' : 'Add'} room`)

const loadingTitle = computed(() => `${localRoomId ? 'Updating' : 'Creating'} room...`)

const buttonLabel = computed(() => {
    if (isPending.value) {
        return `${localRoomId ? 'Updating' : 'Adding'} room...`
    } else {
        return `${localRoomId ? 'Update' : 'Add'} room`
    }
})



const clearForm = () => {
    resetForm()
    existingImageSrc.value = ''
}

const emit = defineEmits(['close-modal', 'is-pending'])

watchEffect(() => {
    emit('is-pending', isPending.value)
})

const scrollStore = useScrollStore()


const onSubmitForm = handleSubmit(async (values) => {
    let log = []

    const data = {
        name: values.name,
        icon: values.icon,
        // color: form.value.color,
        desc: values.desc,
    }

    if (localRoomId && !values.file && !existingImageSrc.value && oldImageUrl) {
        data.imgSrc = null;

        addLog(log, 'image', oldImageUrl, null)
    }

    if (localRoomId) {
        addLog(log, 'name', originalData.name, data.name)
        addLog(log, 'icon', originalData.icon, data.icon)
        addLog(log, 'description', originalData.desc, data.desc)
        addLog(log, 'image', oldImageUrl, existingImageSrc.value)
    }

    if (values.file) {
        const resizedFile = await resizeImageBitmap(values.file)

        const uploadSuccess = await uploadImage('rooms', authStore.user, resizedFile)

        if (uploadSuccess) {
            data.imgSrc = url.value;

            if (localRoomId) {
                addLog(log, 'image', oldImageUrl, url.value)
            }
        }
    }

    if (localRoomId) {
        const existingLog = detailsRoom.value?.log || [];

        data.log = [
            ...existingLog,
            ...log
        ];
    } else {
        data.log = log;
    }


    let success = false;

    if (!localRoomId) {
        success = await sendData('rooms', data)
    } else {
        success = await updateData(data, `rooms/${localRoomId}`)
    }

    if (!!success) {
        if (oldImageUrl !== existingImageSrc.value) {
            await deleteImageByUrl(oldImageUrl)
        }

        clearForm();

        if (!localRoomId) {

            scrollStore.setScrollTarget({
                type: 'room',
                roomId: success
            })
        }

        uiStore.closeModal()
        emit('close-modal', false)
    }
})
</script>

<style lang="scss" scoped>
-webkit-color-swatch-wrapper {
    padding: 0 !important;
}

input {
    ::-webkit-color-swatch-wrapper {
        padding: 0;
    }
}
</style>