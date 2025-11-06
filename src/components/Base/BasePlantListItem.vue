<template>
    <li
        class="group p-2 rounded-xl transition-all duration-600 relative"
        :class="[
            isDraggable ? 'bg-gray-100 dark:bg-gray-950 hover:bg-gray-200 dark:hover:bg-gray-950/50 cursor-move' : 'bg-white',
            {
                'hover:bg-primary-500/30': isDraggable && isWatered,
                'bg-primary-500/20': isWatered
            }
        ]"
    >
        <div class="grid grid-cols-[auto_1fr] gap-3 items-center w-full">
            <div class="grid grid-cols-[auto_30px_1fr] gap-3 items-center">
                <div
                    class="rounded-full size-6  flex items-center justify-center relative"
                    :class="isWatered ? 'dark:bg-primary-800' : 'dark:bg-gray-800 '"
                >
                    <span
                        class="material-symbols-outlined w-full text-center text-sm"
                        :class="isWatered ? 'text-primary-300 dark:text-primary-200' : 'text-gray-700 dark:text-gray-500'"
                    >
                        {{ isWatered ? 'humidity_high' : 'water_drop' }}
                    </span>
                    <span
                        v-if="isWateredNow"
                        class="absolute inline-flex h-full w-full animate-plant-watered rounded-full bg-primary-400 opacity-50"
                    />
                </div>
                <div class="w-full h-0 pb-[100%] overflow-hidden rounded-full relative">
                    <img
                        v-if="plant.imgSrc"
                        :src="plant.imgSrc"
                        class="absolute object-cover h-full w-full"
                    />
                    <img
                        v-else
                        src="https://raw.githubusercontent.com/googlefonts/noto-emoji/main/svg/emoji_u1f331.svg"
                        alt="🌱"
                        class="absolute object-cover h-full w-full"
                    />
                </div>
                <div>
                    <div class="text-sm text-gray-700 dark:text-gray-600 font-semibold">
                        {{ plant.name }}
                    </div>
                    <div class="text-xs text-gray-800 dark:text-gray-700">
                        {{ lastWateredDaysAgo }}
                    </div>
                </div>

            </div>
            <div class="flex justify-end">
                <button
                    type="button"
                    class="cursor-pointer px-2 py-2 transition-all duration-600 text-primary-500 hover:text-gray-700 dark:hover:text-gray-400 text-2xl flex items-center dark:disabled:text-gray-900 "
                    :disabled="isWatered"
                    :class="[
                        isWatered ? '' : 'animate-float',
                        { '': isDraggable }
                    ]"
                    @click="handleWatering"
                >
                    <!-- <div class="inline-flex flex-col items-end justify-center gap-1">
                        <span
                            class="material-symbols-outlined w-full text-center text-sm"
                            :class="{ 'text-primary-500': isWatered }"
                        >
                            {{ isWatered ? 'humidity_high' : 'water_drop' }}
                        </span>
                        <span class="text-2xs">
                            {{ lastWateredDaysAgo }}
                        </span>
                    </div> -->

                    <span class="material-symbols-outlined">
                        humidity_high
                    </span>
                </button>
            </div>
        </div>
        <div
            v-if="showMoreDetails"
            class="text-start text-sm"
        >
            <div
                class="p-2 md:p-4 rounded-xl transition-all duration-600 mt-4 text-gray-600 dark:text-gray-500"
                :class="isWatered ? 'bg-white/60 dark:bg-white/5' : 'bg-gray-100 dark:bg-gray-900/25'"
            >
                <div class="grid grid-cols-[1fr_auto] gap-4">
                    <div>
                        {{ plant.desc }}
                    </div>
                    <div>
                        <ul class="flex items-center gap-4">
                            <li>
                                <button
                                    type="button"
                                    class="flex text-xl text-gray-500 hover:text-primary-500 cursor-pointer transition-all duration-600 md:opacity-0 group-hover:opacity-100"
                                    v-tooltip="{
                                        content: 'Edit',
                                        container: 'body'
                                    }"
                                >
                                    <span class="material-symbols-outlined mb-1 text-">
                                        edit
                                    </span>
                                </button>
                            </li>
                            <li>
                                <v-dropdown
                                    trap-focus
                                    popper-class="md:w-[400px] px-4"
                                    @show="onShow"
                                    @hide="onHide"
                                >
                                    <button
                                        type="button"
                                        class="text-2xl text-gray-500 hover:text-red-500 dark:text-red-900 600 cursor-pointer flex transition-all duration-600 md:opacity-0 group-hover:opacity-100"
                                        :class="{ 'md:opacity-100 text-red-500 dark:text-red-900': isOpen }"
                                        v-tooltip="{
                                            content: 'Delete plant',
                                            container: 'body'
                                        }"
                                    >
                                        <span class="material-symbols-outlined">
                                            delete
                                        </span>
                                    </button>
                                    <template #popper>
                                        <base-popover-content>
                                            <template #title>
                                                Delete this plant?
                                            </template>
                                            <template #actions>
                                                <base-button
                                                    btn-style="notRoundedMd"
                                                    btn-size="sm"
                                                    btn-color="neutral"
                                                    :btn-full-width="false"
                                                    class="min-w-1/3"
                                                    v-close-popper="true"
                                                >
                                                    Keep This Plant
                                                </base-button>
                                                <base-button
                                                    btn-style="notRoundedMd"
                                                    btn-size="sm"
                                                    btn-color="danger"
                                                    :btn-full-width="false"
                                                    class="min-w-1/2"
                                                    v-close-popper="true"
                                                    @click="deletePlant"
                                                >
                                                    Yes, Delete This Plant
                                                </base-button>
                                            </template>

                                        </base-popover-content>
                                    </template>
                                </v-dropdown>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </li>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useDeleteData } from '../../composables/useDeleteData';
import { useAuthStore } from '../../stores/useAuthStore';

import { differenceInDays } from "date-fns";

import { useStorage } from '../../composables/useStorage';

import { serverTimestamp } from 'firebase/firestore';
import { useUpdateData } from '../../composables/useUpdateData';

import BaseButton from './BaseButton.vue';
import BasePopoverContent from './BasePopoverContent.vue';

const {
    error: errorUpdateData,
    isPending: isPendingUpdateData,
    updateUserData,
} = useUpdateData()

const props = defineProps({
    plant: {
        type: Object,
        required: true
    },
    showMoreDetails: {
        type: Boolean,
        required: false,
        default: false,
    },
    isDraggable: {
        type: Boolean,
        required: false,
        default: false,
    },
    roomId: {
        type: String,
        required: true,
    }
})

const authStore = useAuthStore()


const {
    error,
    isPending,
    deleteData
} = useDeleteData()


const {
    error: errorUploadImage,
    isPending: isPendingUpload,
    deleteImageByUrl
} = useStorage()

// const isWatered = ref(false)

const getDaysAgo = computed(() => {
    if (!props.plant?.lastWateredDate) {
        return null
    }
    const wateredAt = props.plant?.lastWateredDate.toDate()
    return differenceInDays(new Date(), wateredAt);
})

const lastWateredDaysAgo = computed(() => {
    let wateringMessage = ''
    if (getDaysAgo.value === null) {
        wateringMessage = 'Not yet watered'
    } else {
        const days = getDaysAgo.value;
        wateringMessage = days === 0 ?
            'Watered 0 days ago' : days === 1 ?
                'Watered 1 day ago' : `${days} days ago`
    }

    return wateringMessage;
})

const isWateredNow = ref(false)

const handleWatering = async () => {
    const data = {
        lastWateredDate: serverTimestamp()
    }

    const success = await updateUserData(`users/${authStore.user?.uid}/rooms/${props.roomId}/plants`, props.plant.id, data)

    if (success) {
        isWateredNow.value = true
    }
}

const isWatered = computed(() => {
    if (getDaysAgo.value === null) return false
    return props.plant.wateringFrequency > getDaysAgo.value
})


const deletePlant = async () => {
    const collectionPath = `users/${authStore.user.uid}/rooms/${props.roomId}/plants/`
    const documentId = props.plant.id

    const documentImgSrc = props.plant.imgSrc

    let successDelete = true;
    let success = false;

    if (documentImgSrc) {
        console.log(documentImgSrc)
        successDelete = await deleteImageByUrl(props.plant.imgSrc)
    }

    if (successDelete) {
        console.log(collectionPath)
        console.log(documentId)

        success = await deleteData(collectionPath, documentId)
    }
}


const isOpen = ref(false)

const onShow = () => (isOpen.value = true)
const onHide = () => (isOpen.value = false)

</script>

<style lang="scss" scoped></style>