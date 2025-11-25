<template>
    <div
        class="flex items-center"
        :class="{ 'flex-col items-start gap-4': !!imageToShow }"
    >
        <div
            v-if="!!imageToShow"
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
                :src="imageToShow"
                class="w-full h-full inset-0 object-cover absolute rounded-xl"
                :class="isImageLoaded ? 'opacity-100' : 'opacity-0'"
                loading="lazy"
                @load="onLoad"
                alt="Preview"
            />
            <div
                v-if="isImageLoaded"
                class="absolute top-2 right-2 uppercase bg-black/70 text-white dark:text-white/60 text-2xs px-2 py-1 rounded-full"
            >
                Preview
            </div>
        </div>
        <div class="flex gap-2 md:gap-4 flex-col md:flex-row w-full md:w-auto">
            <div :class="{ 'grid grid-cols-[1fr_auto_1fr] gap-2 items-center': mobileStore.isMobile }">

                <label
                    :for="inputId"
                    class="relative border border-2 cursor-pointer transition-all duration-600 disabled:cursor-not-allowed px-1 py-2 text-base rounded-lg cursor-pointer bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-transparent hover:text-gray-400 disabled:bg-gray-500/50 disabled:border-gray-500/0 disabled:hover:text-white inline-flex overflow-hidden text-center shrink-0 gap-2 items-center"
                >
                    <span class="material-symbols-outlined text-2xl">
                        photo
                    </span>
                    Select photo
                    <input
                        :id="props.inputId"
                        type="file"
                        class="hidden"
                        accept="image/png, image/jpeg, image/jpg, image/gif"
                        @change="handleFile"
                    >
                </label>
                <div
                    v-if="mobileStore.isMobile"
                    class="text-center text-gray-500"
                >
                    or
                </div>
                <div v-if="mobileStore.isMobile">
                    <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        @change="handleFile"
                        class="hidden"
                        ref="mobileCameraInput"
                    />

                    <base-button
                        type="button"
                        btn-style="notRoundedMd"
                        btn-size="base"
                        btn-color="neutralAlt"
                        class="flex gap-2 items-center"
                        @click="handleMobilePhotoCapture"
                    >
                        <span class="material-symbols-outlined text-2xl">
                            photo_camera
                        </span>
                        Take photo
                    </base-button>
                </div>
            </div>
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
    </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';

import BaseButton from '../BaseButtons/BaseButton.vue';

import { useMobileStore } from '../../../stores/useMobileStore';

const props = defineProps({
    inputId: {
        type: String,
        required: true
    },
    existingImageSrc: {
        type: String,
        required: false,
        default: null
    }
})

const mobileStore = useMobileStore()


const emit = defineEmits(['send-file'])

const allowedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']

const selectFileName = ref(null)

const previewUrl = ref(null)

const file = ref(null)

const isImageLoaded = ref(false)

const existingImage = ref(props.existingImageSrc)


watch(() => props.existingImageSrc, newVal => {
    if (newVal) {
        existingImage.value = newVal
    }
})

const handleFile = (e) => {
    file.value = e.target.files[0];

    selectFileName.value = file.value.name

    console.log(selectFileName.value)

    if (previewUrl.value) {
        URL.revokeObjectURL(previewUrl.value)
    }
    previewUrl.value = URL.createObjectURL(file.value)


    if (!selectFileName.value || !allowedFormats.includes(file.value.type)) return

    emit('send-file', file.value)
}

const imageToShow = computed(() => !!previewUrl.value ? previewUrl.value : existingImage.value)



const onLoad = () => {
    isImageLoaded.value = true
}

const mobileCameraInput = ref(null)

const handleMobilePhotoCapture = () => {
    mobileCameraInput.value.click()
}

</script>

<style lang="scss" scoped></style>