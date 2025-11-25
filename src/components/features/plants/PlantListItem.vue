<template>
    <li
        ref="plantRef"
        class="group rounded-xl transition-all duration-600 relative grid md:grid-cols-[60px_1fr] p-2 md:gap-4"
        :class="[
            mobileStore.isMobile && isDraggable ? 'grid-cols-[auto_60px_1fr]' : 'grid-cols-[60px_1fr]',
            isDraggable && unassignedRoomPlant && 'bg-gray-200 dark:bg-gray-900 hover:bg-gray-300/75 dark:hover:bg-gray-900/50',
            isDraggable && !unassignedRoomPlant && 'bg-gray-100 dark:bg-gray-950 hover:bg-gray-200 dark:hover:bg-gray-950/50',
            !mobileStore.isMobile && 'js-plant-handle',
            isDraggable ? 'cursor-move' : 'bg-gray-50 dark:bg-gray-900'
        ]"
    >
        <button
            v-if="mobileStore.isMobile && isDraggable"
            type="button"
            class="size-5 h-full left-0 text-xl text-gray-400 dark:text-gray-600 mr-2 flex items-center js-plant-handle"
        >
            <span class="material-symbols-outlined">
                drag_handle
            </span>
        </button>
        <div class="relative mr-4 md:mr-0">
            <div
                class="w-full h-0 pb-[100%] overflow-hidden rounded-full relative shrink-0 shadow-popover"
                :class="isWatered ? '' : 'grayscale'"
            >
                <div
                    v-if="!isImageLoaded"
                    class="bg-gray-200 dark:bg-gray-800 animate-pulse absolute w-full h-full inset-0 rounded-xl flex justify-center"
                >
                    <base-loader
                        class=""
                        loader-size="sm"
                        position-type="absolute"
                    />
                </div>
                <div :class="{ 'absolute p-2 h-full w-full': !plant.imgSrc }">
                    <img
                        ref="imgRef"
                        :key="plant.imgSrc"
                        :data-src="plant.imgSrc || PLANT_PLACEHOLDER"
                        class=""
                        :alt="plant.name"
                        :class="[
                            isImageLoaded ? 'opacity-100' : 'opacity-0',
                            plant.imgSrc ? 'h-full w-full' : 'absolute object-cover inset-2'
                        ]"
                        loading="lazy"
                        @load="onLoad"
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
                    class="absolute inline-flex h-full w-full animate-plant-watered fill-mode-forwards rounded-full bg-primary-400 opacity-50"
                />
            </div>
        </div>

        <div class="grid grid-cols-[auto_1fr] gap-3 items-center w-full">
            <div class="grid grid-cols-[auto_1fr] gap-3 items-center">
                <div class="min-w-0">
                    <div class="text-sm text-gray-700 dark:text-gray-600 font-semibold overflow-hidden text-ellipsis">
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
                        class="js-water-btn cursor-pointer py-2 pl-2 pr-1 transition-all duration-600 text-primary-500 hover:text-primary-700 dark:hover:text-primary-700 text-2xl flex items-center disabled:cursor-not-allowed disabled:text-gray-500/20 dark:disabled:text-gray-800 "
                        :disabled="isWatered"
                        :class="[
                            isWatered ? '' : 'animate-float',
                            { '': isDraggable }
                        ]"
                        @click="handleWatering"
                    >
                        <span class="material-symbols-outlined">
                            {{ isWatered ? 'humidity_high' : 'water_drop' }}
                        </span>
                    </button>
                    <v-dropdown
                        trap-focus
                        @show="onShow"
                        @hide="onHide"
                        popper-class="popper-slide-small"
                    >
                        <button
                            type="button"
                            class="js-actions-btn py-2 pr-2 pl-1 text-2xl text-gray-400 hover:text-gray-700 dark:text-gray-700 dark:hover:text-gray-500 cursor-pointer flex transition-all duration-600"
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
                                                @click="uiStore.openModal('plantHistory', { roomId: props.roomId, plantId: props.plant.id })"
                                            >
                                                <span class="material-symbols-outlined text-xl">
                                                    history
                                                </span>
                                                <span>
                                                    History
                                                </span>
                                            </button>
                                        </li>
                                        <li>
                                            <button
                                                type="button"
                                                class="flex gap-2 items-center text-base text-gray-500 hover:text-primary-500 cursor-pointer transition-all duration-600 p-2"
                                                v-close-popper="true"
                                                @click="uiStore.openModal('plant', { roomId: props.roomId, plantId: props.plant.id })"
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
                                                v-close-popper="true"
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
            <div class="pl-[calc(var(--spacing)*12+30px)] pr-2 rounded-xl transition-all duration-600 text-gray-400 dark:text-gray-500">
                <div class="">
                    <div>
                        <p>
                            {{ shortenDesc }}
                        </p>
                        <button
                            v-if="showMoreButton"
                            class="text-primary-500 underline hover:no-underline mt-1 cursor-pointer"
                            @click="toggleShowMore"
                        >
                            {{ showMoreText }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </li>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';

import { differenceInDays } from "date-fns";

import BaseLoader from '@/components/base/BaseLoader.vue';
import BasePopoverContent from '@/components/base/BasePopoverContent.vue';

import { useMobileStore } from '@/stores/useMobileStore';
import { usePlantsStore } from '@/stores/usePlantsStore';

import { useDeleteData, useStorage, useUpdateData } from '@/composables';

import { addDelay, observeVisibility } from '@/utils';
import { useUIStore } from '../../../stores/useUIStore';

const {
    error: errorUpdateData,
    isPending: isPendingUpdateData,
    waterPlant
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

const PLANT_PLACEHOLDER = 'https://raw.githubusercontent.com/googlefonts/noto-emoji/main/svg/emoji_u1f331.svg'

const plantsStore = usePlantsStore()
const uiStore = useUIStore()
const mobileStore = useMobileStore()

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

const isWateredNow = computed(() => plantsStore.isWateredNow(props.plant.id))

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

const handleWatering = async () => {
    plantsStore.setPlantVisible(props.plant.id, true)

    await waterPlant(props.plant.id)
}

const isWatered = computed(() => {
    if (getDaysAgo.value === null) return false
    return props.plant.wateringFrequency > (getDaysAgo.value)
})

const handleDeletePlant = async () => {
    const collectionPath = `rooms/${props.roomId}/plants`
    const documentId = props.plant.id

    const documentImgSrc = props.plant.imgSrc

    let successDelete = true;
    let success = false;

    const el = document.querySelector(`[data-plant-id="${props.plant.id}"]`)

    el.classList.add('animate-popOut', 'transition-discrete', 'fill-mode-forwards')
    await addDelay(1000)

    if (documentImgSrc) successDelete = await deleteImageByUrl(props.plant.imgSrc)

    if (successDelete) success = await deleteData(documentId, collectionPath)
}

const isOpen = ref(false)

const onShow = () => (isOpen.value = true)
const onHide = () => (isOpen.value = false)

const unassignedRoomPlant = computed(() => props.roomId === 'unassigned')

const isImageLoaded = ref(false)

const onLoad = () => {
    isImageLoaded.value = true
}

const imgRef = ref(null)

onMounted(async () => {
    const el = imgRef.value
    if (!el) return

    if (el) {
        await observeVisibility(el, { threshold: 0.2, rootMargin: '150px' })

        if (el.dataset.src) {
            el.src = el.dataset.src
            el.removeAttribute('data-src')
        }
    }
})

watch(() => props.plant.imgSrc, (newVal) => {
    const el = imgRef.value
    if (!el) return

    if (newVal === null) {
        el.dataset.src = PLANT_PLACEHOLDER
        el.src = PLANT_PLACEHOLDER
    } else {
        el.src = newVal
        el.dataset.src = newVal

    }

}, {
    flush: 'post'
})

const showMore = ref(false)

const toggleShowMore = () => {
    showMore.value = !showMore.value
}

const shortenDesc = computed(() => {
    const desc = props.plant.desc || '';

    if (showMore.value) return desc

    return desc.length > 200 ? desc.substring(0, 200) + '...' : desc
})

const showMoreButton = computed(() => (props.plant.desc?.length || 0) > 200)

const showMoreText = computed(() => `Show ${showMore.value ? 'less' : 'more'}`)


</script>

<style lang="scss" scoped></style>