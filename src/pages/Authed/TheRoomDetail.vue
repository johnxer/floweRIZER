<template>
    <div>
        <base-container v-if="isPending || !detailsRoom">
            <base-loader />
        </base-container>
        <div v-else>
            <div class="relative w-full h-[200px] md:h-[300px] overflow-hidden flex items-center justify-center shadow-xl before:absolute before:inset-0 before:bg-black/30">
                <base-loader
                    v-if="!isImageLoaded"
                    class="absolute"
                />
                <img
                    :src="detailsRoom.imgSrc || '/src/assets/images/room_default.jpg'"
                    class="w-full object-cover dark:brightness-50"
                    :alt="roomName"
                    loading="lazy"
                    @load="onLoad"
                >
                <base-page-title
                    class="absolute p-4 md:p-6"
                    :is-default-title="false"
                >
                    <span class="inline-flex align-top items-center gap-3">
                        <span class="material-symbols-outlined">
                            {{ detailsRoom.icon }}
                        </span>
                        {{ roomName }}

                        <v-dropdown
                            v-if="props.roomId !== 'unassigned'"
                            trap-focus
                            @show="onShow"
                            @hide="onHide"
                            popper-class="popper-slide-small"
                        >
                            <button
                                type="button"
                                class="p-2 text-xl md:text-2xl dark:text-white/80 cursor-pointer flex transition-all duration-600 rounded-full bg-black/40 hover:bg-black/80 text-white/80 hover:text-white/90"
                                :class="{ 'bg-black/80 text-white/90 dark:text-gray-500': isOpen }"
                                v-tooltip="{
                                    content: 'Room actions',
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
                                                    @click="editRoom"
                                                    v-close-popper
                                                >
                                                    <span class="material-symbols-outlined text-xl">
                                                        edit
                                                    </span>
                                                    <span>
                                                        Edit room
                                                    </span>
                                                </button>
                                            </li>
                                            <li>
                                                <button
                                                    type="button"
                                                    class="flex gap-2 items-center text-base text-gray-500 hover:text-red-500 dark:text-red-900 600 cursor-pointer flex transition-all duration-600 p-2"
                                                    @click="deleteRoom"
                                                >
                                                    <span class="material-symbols-outlined text-xl">
                                                        delete
                                                    </span>
                                                    <span>
                                                        Delete room
                                                    </span>
                                                </button>

                                            </li>
                                        </ul>
                                    </template>
                                </base-popover-content>

                            </template>
                        </v-dropdown>
                    </span>
                </base-page-title>
            </div>
            <base-container>
                <div class="lg:max-w-[500px] md:max-w-[400px] max-w-full mx-auto">
                    <div class="text-gray-400 dark:text-gray-500 text-sm mb-1">
                        Created on {{ formattedDate }}
                    </div>
                    <div class="mb-8 text-gray-500 dark:text-gray-400 text-sm">
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
                    <div class="">
                        <div>
                            <h3
                                v-if="existPlants"
                                class="text-2xl mb-1 text-gray-600 text-center"
                            >
                                Plants
                            </h3>
                            <div class="group/card">
                                <transition-group
                                    v-if="existPlants"
                                    name="fade"
                                    tag="ul"
                                    class="space-y-4 mb-4"
                                >
                                    <base-plant-list-item
                                        v-for="plant in plants"
                                        :key="plant.id"
                                        :plant="plant"
                                        :show-more-details="true"
                                        :data-plant-id="plant.id"
                                        :room-id="props.roomId"
                                    />
                                </transition-group>
                                <div class="text-center">
                                    <base-button
                                        type="button"
                                        @click="uiStore.openModal('plant', { roomId: props.roomId })"
                                        class="mb-2 py-1 px-1 md:pr-0 inline-flex align-top items-center leading-none justify-center md:justify-start w-2/5 md:w-auto"
                                        :btn-full-width="false"
                                        btn-style="notRoundedMd"
                                        btn-size="custom"
                                    >
                                        <span class="material-symbols-outlined text-xl mr-1">
                                            add
                                        </span>
                                        <span
                                            class="transition-all duration-400 text-sm flex"
                                            :class="existPlants ? 'md:w-0 group-hover/card:w-[42px] overflow-hidden' : 'w-[42px]'"
                                        >
                                            Plant
                                        </span>
                                    </base-button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </base-container>
        </div>
        <the-modals />
    </div>
</template>

<script setup>
import { computed, ref } from "vue";

import { format } from "date-fns";
import { useRouter } from "vue-router";

import BaseButton from "@/components/base/BaseButtons/BaseButton.vue";
import BaseContainer from "@/components/base/BaseContainer.vue";
import BaseLoader from '@/components/base/BaseLoader.vue';
import BasePageTitle from '@/components/base/BasePageTitle.vue';
import BasePopoverContent from '@/components/base/BasePopoverContent.vue';
import BasePlantListItem from '@/components/features/plants/PlantListItem.vue';

import TheModals from "@/components/TheModals.vue";

import { useUIStore } from "@/stores/useUIStore";

import { useDeleteData, useGetData, useGetDetails, useMoveData, useStorage } from '@/composables';

const props = defineProps({
    roomId: {
        type: String,
        required: true
    },
})

const uiStore = useUIStore()

const {
    error: errorRoom,
    isPending: isPendingRoom,
    data: detailsRoom,
    reload,
} = useGetDetails(`rooms/${props.roomId}`)

const {
    error: errorPlants,
    isPending: isPendingPlants,
    data: plants,
} = useGetData(`rooms/${props.roomId}/plants`)


const {
    error: errorDelete,
    isPending: isPendingDelete,
    deleteData,
} = useDeleteData()

const {
    error: errorMove,
    isPending: isPendingMove,
    movePlants,
} = useMoveData()

const {
    error: errorDeleteImage,
    isPending: isPendingDeleteImage,
    deleteImageByUrl
} = useStorage()

const isPending = computed(() => {
    return isPendingRoom.value || isPendingPlants.value
})

const formattedDate = computed(() => {
    const createdAt = detailsRoom.value?.createdAt
    return createdAt?.toDate ? format(createdAt.toDate(), 'MMM d, yyyy') : '—'
})

const isModalOpen = ref(false)

const toggleModal = (state) => {
    if (typeof state === 'boolean') {
        isModalOpen.value = state
        if (state === false) {
            editPlantId.value = null
        }
    } else {
        isModalOpen.value = !isModalOpen.value
        if (!isModalOpen.value) {
            editPlantId.value = null
        }
    }
}

const isOpen = ref(false)

const onShow = () => (isOpen.value = true)
const onHide = () => (isOpen.value = false)

const roomName = computed(() => {
    const name = detailsRoom.value?.name
    return name === 'Unassigned' ? 'Unassigned plants' : (name || '')
})

const existPlants = computed(() => plants.value?.length)

const editPlantId = ref(null)

const editRoom = () => {
    uiStore.openModal('room', { roomId: props.roomId })
}

const router = useRouter();

const deleteRoom = async () => {
    const oldPhotoUrl = detailsRoom.value?.imgSrc || null

    await movePlants(detailsRoom.value?.id, 'unassigned')

    await deleteData(detailsRoom.value?.id, 'rooms')

    if (oldPhotoUrl) {
        await deleteImageByUrl(oldPhotoUrl)
    }

    router.push({ name: 'TheDashboard' })
}

const showMore = ref(false)

const toggleShowMore = () => {
    showMore.value = !showMore.value
}

const shortenDesc = computed(() => {
    const desc = detailsRoom.value.desc || '';

    if (showMore.value) return desc

    return desc.length > 200 ? desc.substring(0, 200) + '...' : desc
})

const showMoreButton = computed(() => (detailsRoom.value?.desc?.length || 0) > 200)

const showMoreText = computed(() => `Show ${showMore.value ? 'less' : 'more'}`)

const isImageLoaded = ref(false)

const onLoad = () => {
    isImageLoaded.value = true
}

</script>

<style lang="scss" scoped></style>