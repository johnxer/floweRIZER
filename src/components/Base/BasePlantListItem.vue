<template>
    <li
        class="group rounded-xl transition-all duration-600 relative grid grid-cols-[60px_1fr] p-2 gap-4"
        :class="[
            isDraggable ? 'cursor-move' : 'bg-white dark:bg-gray-900',
            unassignedRoomPlant && isDraggable ? 'bg-gray-200 dark:bg-gray-900 hover:bg-gray-300/75 dark:hover:bg-gray-900/50' : 'bg-gray-100 dark:bg-gray-950 hover:bg-gray-200 dark:hover:bg-gray-950/50',
            {

                '': isDraggable && isWatered,
                '': isWatered
            }
        ]"
    >
        <div class="relative">
            <div 
                class="w-full h-0 pb-[100%] overflow-hidden rounded-full relative shrink-0 shadow-popover"
                :class="isWatered ? '' : 'grayscale'"
            >
                <img
                    v-if="plant.imgSrc"
                    :src="plant.imgSrc"
                    class="absolute object-cover h-full w-full"
                />
                <div
                    v-else
                    class="absolute p-2 h-full w-full"
                >
                    <img
                        src="https://raw.githubusercontent.com/googlefonts/noto-emoji/main/svg/emoji_u1f331.svg"
                        alt="🌱"
                        class="absolute object-cover inset-2"
                    />
                </div>
            </div>
            <div
                class="rounded-full size-6 flex items-center justify-center absolute -top-1 -right-1 shadow-popover"
                :class="isWatered ? 'bg-gray-100 dark:bg-gray-800' : 'bg-gray-100 dark:bg-gray-800 '"
            >
                <span
                    class="material-symbols-outlined w-full text-center text-sm"
                    :class="isWatered ? 'text-primary-300 dark:text-primary-200' : 'text-gray-400 dark:text-gray-500'"
                >
                    {{ isWatered ? 'humidity_high' : 'water_drop' }}
                </span>
                <span
                    v-if="isWateredNow"
                    class="absolute inline-flex h-full w-full animate-plant-watered rounded-full bg-primary-400 opacity-50"
                />
            </div>
        </div>

        <div class="grid grid-cols-[auto_1fr] gap-3 items-center w-full">
            <div class="grid grid-cols-[auto_1fr] gap-3 items-center">
                <div>
                    <div class="text-sm text-gray-700 dark:text-gray-600 font-semibold">
                        {{ plant.name }}
                    </div>
                    <div class="text-xs text-gray-400 dark:text-gray-700">
                        {{ lastWateredDaysAgo }}
                    </div>
                </div>

            </div>
            <div class="text-end">
                <div
                    class="inline-flex justify-end  rounded-full transition-colors duration-600"
                    :class="unassignedRoomPlant ? 'bg-gray-100 dark:bg-gray-950' : 'bg-gray-50 group-hover:bg-gray-100 dark:bg-gray-900 dark:group-hover:bg-gray-900'"
                >
                    <button
                        v-tooltip="{
                            content: 'Water plant',
                            container: 'body',
                            disabled: isWatered
                        }"
                        type="button"
                        class="cursor-pointer p-2 transition-all duration-600 text-primary-500 hover:text-primary-700 dark:hover:text-primary-700 text-2xl flex items-center disabled:cursor-not-allowed disabled:text-gray-500/20 dark:disabled:text-gray-800 "
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
                    <v-dropdown
                        trap-focus
                        @show="onShow"
                        @hide="onHide"
                    >
                        <button
                            type="button"
                            class="p-2 text-2xl text-gray-400 hover:text-gray-700 dark:text-gray-700 dark:hover:text-gray-500 cursor-pointer flex transition-all duration-600"
                            :class="{ 'text-gray-700 dark:text-gray-500': isOpen }"
                            v-tooltip="{
                                content: 'Plant actions',
                                container: 'body'
                            }"
                        >
                            <span class="material-symbols-outlined">
                                more_vert
                            </span>
                        </button>
                        <template #popper>
                            <base-popover-content>
                                <template #desc>
                                    <ul class="space-y-2">
                                        <li>
                                            <button
                                                type="button"
                                                class="flex gap-2 items-center text-base text-gray-500 hover:text-primary-500 cursor-pointer transition-all duration-600 p-2"
                                                v-close-popper="true"
                                                @click="handleEditPlant"
                                            >
                                                <span class="material-symbols-outlined text-xl">
                                                    edit
                                                </span>
                                                <span>
                                                    Edit plant
                                                </span>
                                            </button>
                                        </li>
                                        <li>
                                            <button
                                                type="button"
                                                class="flex gap-2 items-center text-base text-gray-500 hover:text-red-500 dark:text-red-900 600 cursor-pointer flex transition-all duration-600 p-2"
                                                @click="handleDeletePlant"
                                            >
                                                <span class="material-symbols-outlined text-xl">
                                                    delete
                                                </span>
                                                <span>
                                                    Delete plant
                                                </span>
                                            </button>

                                        </li>
                                    </ul>
                                </template>
                            </base-popover-content>

                        </template>
                    </v-dropdown>

                </div>
            </div>
        </div>
        <div
            v-if="showMoreDetails"
            class="text-start text-sm col-span-full"
        >
            <div
                class="pl-[calc(var(--spacing)*12+30px)] pr-2 rounded-xl transition-all duration-600 text-gray-400 dark:text-gray-500"
                :class="isWatered ? '' : ''"
            >
                <div class="">
                    <div>
                        {{ plant.desc }}
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
                'Watered 1 day ago' : `Watered ${days} days ago`
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
    return props.plant.wateringFrequency > (getDaysAgo.value + 1)
})


const handleDeletePlant = async () => {
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

const emit = defineEmits(['edit-plant'])

const handleEditPlant = () => {
    emit('edit-plant', props.plant.id)
}


const isOpen = ref(false)

const onShow = () => (isOpen.value = true)
const onHide = () => (isOpen.value = false)

const unassignedRoomPlant = computed(() => props.roomId === 'unassigned')

</script>

<style lang="scss" scoped></style>