<template>
    <base-modal-content>
        <template #modalTitle>
            <span class="noto-color-emoji-regular mr-2">🏠</span>{{ modalTitle }}
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
                                    :input-error="!!formErrors.name"
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
                                <select
                                    @change="formErrors.icon = null"
                                    id="room-icon"
                                    class="px-4 py-2 rounded-lg border-2 w-full focus:outline-0 focus:border-primary transition-colors duration-600 text-gray-500 dark:text-white/75 cursor-pointer"
                                    :class="!formErrors.icon ? 'border-gray-300 dark:border-gray-600' : 'border-red-300 dark:border-red-900'"
                                    v-model="form.icon"
                                >
                                    <option
                                        selected
                                        disabled
                                        value=""
                                    >Select icon...</option>
                                    <option
                                        v-for="icon in roomsStore.roomIcons"
                                        :key="icon.icon"
                                        :value="icon.icon"
                                    >
                                        {{ icon.name }}
                                    </option>
                                </select>

                            </base-input-wrapper-authed>
                            <base-input-wrapper-authed
                                field-label="Image"
                                field-id="room-image"
                            >
                                <base-upload-button
                                    input-id="room-image"
                                    :existing-image-src="existingImageSrc"
                                    @send-file="handleFile"
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

import BaseButton from './Base/BaseButtons/BaseButton.vue';
import BaseInput from './Base/BaseForm/BaseInput.vue';
import BaseInputWrapperAuthed from './Base/BaseForm/BaseInputWrapperAuthed.vue';
import BaseTextarea from './Base/BaseForm/BaseTextarea.vue';
import BaseUploadButton from './Base/BaseForm/BaseUploadButton.vue';
import BaseLoader from './Base/BaseLoader.vue';
import BaseModalContent from './Base/BaseModal/BaseModalContent.vue';

import { useGetDetails, useSendData, useStorage } from '../composables';
import { useAuthStore } from '../stores/useAuthStore';
import { useRoomsStore } from '../stores/useRoomsStore';
import { useScrollStore } from '../stores/useScrollStore';
import { addLog } from '../utils/addLog';
import { resizeImageBitmap } from '../utils/imageResize';

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

const {
    error: errorSendData,
    isPending: isPendingSendData,
    sendDataRooms,
    updateDataRooms
} = useSendData()

const {
    error: errorUpload,
    url,
    filePath,
    isPending: isPendingUpload,
    uploadImage,
    deleteImageByUrl
} = useStorage()

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
const isPending = computed(() => isPendingRoom.value || isPendingSendData.value || isPendingUpload.value)

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
        success = await sendDataRooms(data)
    } else {
        success = await updateDataRooms(data, localRoomId, true)
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

        roomsStore.closeRoomModal()
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