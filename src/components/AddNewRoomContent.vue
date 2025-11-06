<template>
    <base-modal-content>
        <template #modalTitle>
            {{ modalTitle }}
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
                                class="px-4 py-2 rounded-xl border-2 w-full focus:outline-0 focus:border-primary transition-colors duration-600 text-gray-500 dark:text-white/75 cursor-pointer"
                                :class="!formErrors.icon ? 'border-gray-300 dark:border-gray-500' : 'border-red-300 dark:border-red-900'"
                                v-model="form.icon"
                            >
                                <option
                                    selected
                                    disabled
                                    value=""
                                >Select icon...</option>
                                <option
                                    v-for="icon in icons"
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
                            <div
                                class="flex items-center"
                                :class="{ 'flex-col items-start gap-4': !!existingImageSrc || !!previewUrl }"
                            >
                                <div
                                    v-if="!!existingImageSrc || !!previewUrl"
                                    class="relative w-full h-[200px] rounded-xl"
                                >
                                    <div
                                        v-if="!isImageLoaded"
                                        class="bg-gray-200 animate-pulse absolute w-full h-full inset-0 rounded-xl flex justify-center"
                                    >
                                        <div class="size-8 rounded-full bg-gray-300 absolute top-[80px] -ml-[70px]" />
                                        <div class="absolute bottom-0 flex items-end justify-center w-full pl-[90px]">
                                            <div class="w-0 h-0 border-l-[60px] border-l-transparent border-r-[60px] border-r-transparent border-b-[80px] border-b-gray-300 absolute" />
                                            <div class="w-0 h-0 border-l-[30px] border-l-transparent border-r-[30px] border-r-transparent border-b-[40px] border-b-gray-300 absolute -ml-[160px]" />
                                        </div>
                                    </div>
                                    <img
                                        :src="existingImageSrc || previewUrl"
                                        class="w-full h-full inset-0 object-cover absolute rounded-xl"
                                        :class="isImageLoaded ? 'opacity-100' : 'opacity-0'"
                                        loading="lazy"
                                        @load="onLoad"
                                    />
                                    <div v-if="isImageLoaded" class="absolute top-2 right-2 uppercase bg-black/70 text-white text-2xs px-2 py-1 rounded-full">
                                        Preview
                                    </div>
                                </div>
                                <div class="flex gap-2">
                                    <label
                                        for="room-image"
                                        class="relative border border-2 cursor-pointer transition-all duration-600 disabled:cursor-not-allowed px-2 py-2 text-base rounded-xl cursor-pointer bg-gray-200 text-gray-500 dark:text-gray-200 border-gray-200 hover:bg-transparent hover:text-gray-400 disabled:bg-gray-500/50 disabled:border-gray-500/0 disabled:hover:text-white inline-block overflow-hidden"
                                    >
                                        {{ !!existingImageSrc ? 'Update' : 'Upload' }} file
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
                                        {{ selectFileName }}
                                    </div>
                                </div>
                            </div>
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
                        btn-style="notRounded"
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
import { useRoomStore } from '../stores/useRoomStore';

import BaseButton from './Base/BaseButton.vue';
import BaseInput from './Base/BaseInput.vue';
import BaseInputWrapperAuthed from './Base/BaseInputWrapperAuthed.vue';
import BaseLoader from './Base/BaseLoader.vue';
import BaseModalContent from './Base/BaseModal/BaseModalContent.vue';
import BaseTextarea from './Base/BaseTextarea.vue';


const props = defineProps({
    roomId: {
        type: String,
        required: false,
        default: null
    },
    prefillContent: {
        type: Boolean,
        required: false,
        default: false
    }
})

const authStore = useAuthStore()


const {
    roomIcons: icons,
    // roomDefaultColor: color
} = useRoomStore()

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

const {
    error: errorRoom,
    isPending: isPendingRoom,
    details: detailsRoom,
} = useGetDetails(`rooms/${props.roomId}`)

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

watch(detailsRoom, (newVal) => {
    if (newVal) {
        form.value.name = newVal.name || '';
        form.value.icon = newVal.icon || '';
        form.value.desc = newVal.desc || '';
        existingImageSrc.value = newVal.imgSrc
    }
}, { immediate: true })


const modalTitle = computed(() => {
    return props.roomId ? 'Edit room' : 'Create room'
})


const buttonLabel = computed(() => {
    if (isPending.value) {
        return props.roomId ? 'Updating room...' : 'Creating room...'
    } else {
        return props.roomId ? 'Update room' : 'Create room'

    }


})




const formErrors = ref({})

const allowedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']

const selectFileName = ref(null)

const previewUrl = ref(null)

const handleFile = (e) => {
    form.value.file = e.target.files[0];

    console.log(form.value.file)

    selectFileName.value = form.value.file.name

    existingImageSrc.value = null

    previewUrl.value = URL.createObjectURL(form.value.file)

    if (!selectFileName.value || !allowedFormats.includes(selectFileName.value.type)) return

}

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

    if (!props.roomId) {
        success = await sendDataRooms(data.value)
    } else {
        success = await updateDataRooms(data.value, props.roomId)
    }

    if (success) {
        clearForm();

        emit('close-modal')
    }
}


const isImageLoaded = ref(false)


const onLoad = () => {
    isImageLoaded.value = true
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