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
            </transition>
            <div>
                <div>
                    <form
                        @submit.prevent="submitForm"
                        novalidate
                    >
                        <div class="space-y-4">
                            <base-input-wrapper-authed
                                field-label="Name"
                                field-id="room-name"
                                :errorText="formErrors.name"
                            >
                                <base-input
                                    input-id="room-name"
                                    input-placeholder="Enter room name..."
                                    :input-error="formErrors.name"
                                    class="w-full"
                                    v-model.trim="form.name"
                                    @input="formErrors.name = null"
                                />
                            </base-input-wrapper-authed>

                            <base-input-wrapper-authed
                                field-label="Icon"
                                field-id="room-icon"
                                :errorText="formErrors.icon"
                            >
                                <div class="grid grid-cols-4 gap-2">
                                    <button
                                        v-for="icon in roomsStore.roomIcons"
                                        :key="icon.icon"
                                        type="button"
                                        @click="form.icon = icon.icon; formErrors.icon = null"
                                        class="flex flex-col items-center justify-center p-2 rounded-lg border-2 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                                        :class="[
                                            form.icon === icon.icon
                                                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600'
                                                : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400'
                                        ]"
                                    >
                                        <span class="material-symbols-outlined text-2xl mb-1">
                                            {{ icon.icon }}
                                        </span>
                                        <span class="text-xs text-center truncate w-full">
                                            {{ icon.name }}
                                        </span>
                                    </button>
                                </div>

                            </base-input-wrapper-authed>

                            <base-input-wrapper-authed
                                field-label="Image"
                                field-id="room-image"
                            >
                                <base-upload-button
                                    input-id="room-image"
                                    :existing-image-src="existingImageSrc"
                                    @send-file="handleFile"
                                    @remove-file="handleRemoveFile"
                                />

                            </base-input-wrapper-authed>

                            <base-input-wrapper-authed
                                field-label="Description"
                                field-id="room-description"
                            >
                                <base-textarea
                                    textarea-id="room-description"
                                    textarea-placeholder="Enter room description..."
                                    v-model.trim="form.desc"
                                />
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
            </div>
        </div>
    </base-modal-content>
</template>

<script setup>
import { computed, ref, watch, watchEffect } from 'vue';

import BaseButton from '@/components/base/BaseButtons/BaseButton.vue';
import BaseInput from '@/components/base/BaseForm/BaseInput.vue';
import BaseInputWrapperAuthed from '@/components/base/BaseForm/BaseInputWrapperAuthed.vue';
import BaseTextarea from '@/components/base/BaseForm/BaseTextarea.vue';
import BaseUploadButton from '@/components/base/BaseForm/BaseUploadButton.vue';
import BaseLoader from '@/components/base/BaseLoader.vue';
import BaseModalContent from '@/components/base/BaseModal/BaseModalContent.vue';

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

// const error = computed(() => errorSendData.value || errorUpload.value)
const isPending = computed(() => isPendingRoom.value || isPendingSendData.value || isPendingUpload.value || isPendingUpdate.value)

const form = ref({
    name: '',
    icon: '',
    file: null,
    // color: color,
    desc: ''
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

const handleRemoveFile = ({ toDefault }) => {
    form.value.file = null;

    console.log('toDefault', toDefault)

    if (!toDefault) {

        if (oldImageUrl) {
            existingImageSrc.value = oldImageUrl;
        }
    } else {
        existingImageSrc.value = null;
    }
}

watch(detailsRoom, (newVal) => {
    if (newVal) {
        form.value.name = newVal.name || '';
        form.value.icon = newVal.icon || '';
        form.value.desc = newVal.desc || '';
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

const formErrors = ref({})

const validateForm = () => {
    formErrors.value = {}

    if (!form.value.name) {
        formErrors.value.name = 'Room name cannot be empty'
    }

    if (!form.value.icon) {
        formErrors.value.icon = 'Room icon has to be selected'
    }

    return Object.keys(formErrors.value).length === 0
}

const clearForm = () => {
    form.value.name = ''
    form.value.icon = ''
    form.value.imgSrc = ''
    // form.value.color = color
    form.value.desc = ''
}

const emit = defineEmits(['close-modal', 'is-pending'])

watchEffect(() => {
    emit('is-pending', isPending.value)
})

const scrollStore = useScrollStore()

const submitForm = async () => {
    if (!validateForm()) return;

    let log = []

    const data = {
        name: form.value.name,
        icon: form.value.icon,
        // color: form.value.color,
        desc: form.value.desc,
    }

    if (localRoomId && !form.value.file && !existingImageSrc.value && oldImageUrl) {
        data.imgSrc = null;

        addLog(log, 'image', oldImageUrl, null)
    }

    if (localRoomId) {
        addLog(log, 'name', originalData.name, data.name)
        addLog(log, 'icon', originalData.icon, data.icon)
        addLog(log, 'description', originalData.desc, data.desc)
        addLog(log, 'image', oldImageUrl, existingImageSrc.value)
    }

    if (form.value.file) {
        const resizedFile = await resizeImageBitmap(form.value.file)

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
}
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