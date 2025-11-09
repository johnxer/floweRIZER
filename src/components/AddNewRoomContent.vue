<template>
    <base-modal-content>
        <template #modalTitle>
            <span class="noto-color-emoji-regular mr-2">🏠</span>{{ modalTitle }}
        </template>
        <base-loader v-if="isPendingRoom" />
        <div v-else>
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
                            <!-- <div
                                class="flex items-center"
                                :class="{ 'flex-col items-start gap-4': !!existingImageSrc || !!previewUrl }"
                            >
                                <div
                                    v-if="!!existingImageSrc || !!previewUrl"
                                    class="relative w-full h-[200px] rounded-xl"
                                >
                                    <div
                                        v-if="!isImageLoaded"
                                        class="bg-gray-200 dark:bg-gray-800 animate-pulse absolute w-full h-full inset-0 rounded-xl flex justify-center"
                                    >
                                        <div class="size-8 rounded-full bg-gray-300 dark:bg-gray-900 absolute top-[80px] -ml-[70px]" />
                                        <div class="absolute bottom-0 flex items-end justify-center w-full pl-[90px]">
                                            <div class="w-0 h-0 border-l-[60px] border-l-transparent border-r-[60px] border-r-transparent border-b-[80px] border-b-gray-300 dark:border-b-gray-900 absolute" />
                                            <div class="w-0 h-0 border-l-[30px] border-l-transparent border-r-[30px] border-r-transparent border-b-[40px] border-b-gray-300 dark:border-b-gray-900 absolute -ml-[160px]" />
                                        </div>
                                    </div>
                                    <img
                                        :src="existingImageSrc || previewUrl"
                                        class="w-full h-full inset-0 object-cover absolute rounded-xl"
                                        :class="isImageLoaded ? 'opacity-100' : 'opacity-0'"
                                        loading="lazy"
                                        @load="onLoad"
                                    />
                                    <div v-if="isImageLoaded" class="absolute top-2 right-2 uppercase bg-black/70 text-white dark:text-white/60 text-2xs px-2 py-1 rounded-full">
                                        Preview
                                    </div>
                                </div>
                                <div class="flex gap-2 md:gap-4 flex-col md:flex-row w-full md:w-auto">
                                    <label
                                        for="room-image"
                                        class="relative border border-2 cursor-pointer transition-all duration-600 disabled:cursor-not-allowed px-4 py-2 text-base rounded-lg cursor-pointer bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-transparent hover:text-gray-400 disabled:bg-gray-500/50 disabled:border-gray-500/0 disabled:hover:text-white inline-block overflow-hidden text-center shrink-0"
                                    >
                                        Select image
                                        <input
                                            id="room-image"
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
                                        <span class="text-wrap">
                                            {{ selectFileName }}
                                        </span>
                                    </div>
                                </div>
                            </div> -->
                        </base-input-wrapper-authed>
                        <!-- <base-input-wrapper-authed
                            field-label="Room colour"
                            field-id="room-color"
                        >
                            <div class="rounded-lg overflow-hidden size-[34px] relative border-2 border-gray-300">
                                <input
                                    type="color"
                                    id="room-color"
                                    class="focus:outline-0 border-0 p-0 absolute inset-0 w-full h-full cursor-pointer"
                                    v-model="form.color"
                                >
                            </div>
                        </base-input-wrapper-authed> -->
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
    </base-modal-content>
</template>

<script setup>

import { computed, ref, watch } from 'vue';
import { useGetDetails } from '../composables/useGetDetail';
import { useSendData } from '../composables/useSendData';
import { useStorage } from '../composables/useStorage';
import { useAuthStore } from '../stores/useAuthStore';
import { useRoomsStore } from '../stores/useRoomsStore';

import BaseButton from './Base/BaseButton.vue';
import BaseInput from './Base/BaseForm/BaseInput.vue';
import BaseInputWrapperAuthed from './Base/BaseForm/BaseInputWrapperAuthed.vue';
import BaseTextarea from './Base/BaseForm/BaseTextarea.vue';
import BaseUploadButton from './Base/BaseForm/BaseUploadButton.vue';
import BaseLoader from './Base/BaseLoader.vue';
import BaseModalContent from './Base/BaseModal/BaseModalContent.vue';


const props = defineProps({
    roomId: {
        type: String,
        required: false,
        default: null
    },
})

const localRoomId = ref(props.roomId)

const authStore = useAuthStore()

const roomsStore = useRoomsStore()

// const {
//     roomIcons: icons,
//     // roomDefaultColor: color
// } = useRoomsStore()

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
} = useStorage()

let errorRoom, isPendingRoom, detailsRoom

if (localRoomId.value) {
    ({
        error: errorRoom,
        isPending: isPendingRoom,
        details: detailsRoom,
    } = useGetDetails(`rooms/${localRoomId.value}`))
} else {
    errorRoom = ref(null)
    isPendingRoom = ref(false)
    detailsRoom = ref(null)
}

// const error = computed(() => errorSendData.value || errorUpload.value)
const isPending = computed(() => isPendingSendData.value || isPendingUpload.value)

const form = ref({
    name: '',
    icon: '',
    file: null,
    // color: color,
    description: ''
})

const existingImageSrc = ref('')

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
    }
}, { immediate: true })


const modalTitle = computed(() => `${localRoomId.value ? 'Edit' : 'Add'} room`)

const buttonLabel = computed(() => {
    if (isPending.value) {
        return `${localRoomId.value ? 'Updating' : 'Adding'} room...`
    } else {
        return `${localRoomId.value ? 'Update' : 'Add'} room`
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

const emit = defineEmits(['close-modal'])

const data = ref({});

const submitForm = async () => {
    if (!validateForm()) return;

    data.value = {
        name: form.value.name,
        icon: form.value.icon,
        // color: form.value.color,
        desc: form.value.desc,
    }

    if (form.value.file) {
        const uploadSuccess = await uploadImage('rooms', authStore.user, form.value.file)

        if (uploadSuccess) {

            data.value = {
                ...data.value,
                imgSrc: url.value,
            }
        }
    }

    let success = false;

    if (!localRoomId.value) {
        success = await sendDataRooms(data.value)
    } else {
        success = await updateDataRooms(data.value, localRoomId.value)
    }

    if (success) {
        clearForm();

        roomsStore.closeRoomModal()
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