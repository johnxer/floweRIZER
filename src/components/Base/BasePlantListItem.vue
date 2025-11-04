<template>
    <li
        class="group p-2 rounded-xl transition-all duration-600 relative"
        :class="[
            isWatered ? 'bg-primary-500/20' : 'bg-gray-100 dark:bg-gray-800',
            { 'hover:bg-gray-200 dark:hover:bg-gray-700/75 cursor-move': isDraggable },
            { 'hover:bg-primary-500/30': isDraggable && isWatered }
        ]"
    >
        <div class="grid grid-cols-[auto_1fr] gap-3 items-center w-full">
            <div class="grid grid-cols-[30px_1fr] gap-3 items-center">
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
                <div class="text-sm text-gray-700 dark:text-white/50">
                    {{ plant.name }}
                </div>
            </div>
            <div class="flex justify-end">
                <button
                    type="button"
                    class="cursor-pointer border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-600 text-gray-500 hover:text-gray-700 dark:hover:text-gray-400 min-w-[70px]"
                    :class="[
                        isWatered ? '' : '',
                        { 'group-hover:border-gray-300 dark:group-hover:border-gray-600': isDraggable }
                    ]"
                    @click="handleWatering"
                >
                    <div class="inline-flex flex-col items-end justify-center gap-1">
                        <span
                            class="material-symbols-outlined w-full text-center text-sm"
                            :class="{ 'text-primary-500': isWatered }"
                        >
                            {{ isWatered ? 'humidity_high' : 'water_drop' }}
                        </span>
                        <span class="text-2xs">
                            {{ lastWateredDaysAgo }}
                        </span>
                    </div>
                </button>
            </div>
        </div>
        <div
            v-if="showMoreDetails"
            class="text-start text-sm"
        >

            <div
                class="p-2 md:p-4 rounded-xl transition-all duration-600 mt-4 text-gray-600 dark:text-gray-500"
                :class="isWatered ? 'bg-white/60' : 'bg-gray-200 dark:bg-gray-900/50'"
            >
                <div class="grid grid-cols-[1fr_auto] gap-4">
                    <div>
                        {{ plant.desc }}
                    </div>
                    <div>
                        <ul class="flex items-center gap-4 transition-all duration-600 md:opacity-0 group-hover:opacity-100">
                            <li>
                                <button
                                    type="button"
                                    class="flex text-xl text-gray-500 hover:text-primary-500 cursor-pointer "
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
                                        class="text-2xl text-gray-500 hover:text-red-500 dark:text-red-900 600 cursor-pointer flex"
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
                                        <div class="p-4">
                                            <div class="text-lg mb-2 text-gray-700">
                                                <strong>
                                                    Delete this plant?
                                                </strong>
                                            </div>
                                            <div class="mt-4 flex justify-between">
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

                                            </div>
                                        </div>
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
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import { useDeleteData } from '../../composables/useDeleteData';
import { useAuthStore } from '../../stores/useAuthStore';

import { differenceInDays } from "date-fns";

import BaseButton from "../../components/Base/BaseButton.vue";
import { useStorage } from '../../composables/useStorage';

import { serverTimestamp } from 'firebase/firestore';
import { useUpdateData } from '../../composables/useUpdateData';

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

const {
    user
} = storeToRefs(useAuthStore())

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

const daysAgo = ref(null)

const lastWateredDaysAgo = computed(() => {
    let wateringMessage = ''
    if (!props.plant?.lastWateredDate) {
        wateringMessage = 'Not yet watered'
    } else {
        const wateredAt = props.plant?.lastWateredDate.toDate()
        daysAgo.value = differenceInDays(wateredAt, new Date());

        wateringMessage = daysAgo.value === 0 ?
            '0 days ago' : daysAgo.value === 1 ?
                '1 day ago' : `${daysAgo.value} days ago`
    }

    return wateringMessage;
})

const handleWatering = async () => {

    const data = {
        lastWateredDate: serverTimestamp()
    }

    const success = await updateUserData(`users/${user.value?.uid}/rooms/${props.roomId}/plants`, props.plant.id, data)

    // if (success) {
    //     isWatered.value = !isWatered.value
    // }
}

const isWatered = computed(() => {
    if (daysAgo.value === null) return false
    return props.plant.wateringFrequency > daysAgo.value
})


const deletePlant = async () => {
    const collectionPath = `users/${user.value.uid}/rooms/${props.roomId}/plants/`
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