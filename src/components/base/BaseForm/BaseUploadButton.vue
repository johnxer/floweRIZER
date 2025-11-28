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
                class="absolute top-2 right-2 uppercase bg-black/80 text-white dark:text-white/60 text-2xs px-2 py-1 rounded-full"
            >
                Preview
            </div>

            <v-dropdown
                v-if="isResetImageShown"
                trap-focus
                popper-class="popper-slide-small min-w-[200px]"
                class="absolute bottom-2 right-2"
            >
                <button
                    type="button"
                    class=" uppercase bg-black/80 text-white dark:text-white/80 text-2xl px-2 py-1 rounded-full cursor-pointer"
                    v-tooltip="{
                        content: 'Reset image',
                        container: 'body',
                    }"
                >
                    <span class="material-symbols-outlined">
                        reset_image
                    </span>
                </button>
                <template #popper>
                    <base-popover-content>
                        <template #title>
                            Reset this image?
                        </template>

                        <template #actions>
                            <Button
                                variant="outline"
                                class="min-w-1/3"
                                v-close-popper="true"
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                class="min-w-1/2"
                                v-close-popper="true"
                                @click="handleResetImage"
                            >
                                Yes, reset it
                            </Button>
                        </template>
                    </base-popover-content>
                </template>
            </v-dropdown>

        </div>
        <div class="flex gap-2 md:gap-4 flex-col md:flex-row w-full md:w-auto">
            <div :class="{ 'grid grid-cols-[1fr_auto_1fr] gap-2 items-center': mobileStore.isMobile }">

                <label
                    :for="inputId"
                    class="align-top whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive cursor-pointer duration-600 border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-9 px-4 py-2 has-[>svg]:px-3 flex gap-2 items-center justify-center"
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
                        ref="fileInput"
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

                    <Button
                        type="button"
                        variant="outline"
                        class="flex gap-2 items-center justify-center"
                        @click="handleMobilePhotoCapture"
                    >
                        <span class="material-symbols-outlined text-2xl">
                            photo_camera
                        </span>
                        Take photo
                    </Button>
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

import BasePopoverContent from '@/components/base/BasePopoverContent.vue';

import { Button } from '@/components/ui/button';

import { useMobileStore } from '@/stores/useMobileStore';

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


const emit = defineEmits(['send-file', 'remove-file'])

const allowedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']

const fileInput = ref(null)

const selectFileName = ref(null)

const previewUrl = ref(null)

const file = ref(null)

const isImageLoaded = ref(false)

const existingImageURL = ref(props.existingImageSrc)


watch(() => props.existingImageSrc, newVal => {
    if (newVal) {
        existingImageURL.value = newVal
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

const imageToShow = computed(() => !!previewUrl.value ? previewUrl.value : existingImageURL.value)



const onLoad = () => {
    isImageLoaded.value = true
}

const mobileCameraInput = ref(null)

const handleMobilePhotoCapture = () => {
    mobileCameraInput.value.click()
}

const isResetImageShown = computed(() => (existingImageURL.value || previewUrl.value))

const handleResetImage = () => {
    if (isResetImageShown.value) {

        if (previewUrl.value && previewUrl.value.startsWith('blob:')) {
            URL.revokeObjectURL(previewUrl.value)
            emit('remove-file', { toDefault: false })
        } else {
            existingImageURL.value = null
            emit('remove-file', { toDefault: true })
        }

        selectFileName.value = null
        file.value = null

        previewUrl.value = existingImageURL.value || null



        isImageLoaded.value = false


        if (fileInput.value) {
            fileInput.value.value = ''
        }

    }
}

</script>

<style lang="scss" scoped></style>