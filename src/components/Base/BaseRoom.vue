<template>

    <div
        v-if="!roomsStore.hiddenRooms.includes(room.id) && (!room.isSystem || (room.isSystem && plants?.length > 0))"
        :data-room-id="room.id"
        class="group/card flex flex-col rounded-xl md:p-2 relative items-center md:items-start"
        :class="!!room.isSystem ? 'border-3 border-gray-200 dark:border-gray-800/70 border-dashed' : 'bg-white dark:bg-gray-900/50 shadow-box'"
    >
        <div
            v-if="!room.isSystem"
            class="text-2xl size-[40px] absolute top-[-20px] md:left-[-20px] text-primary-500/50 peer-hover:text-primary-600 transition-colors duration-600 bg-white dark:bg-gray-950 rounded-full flex items-center justify-center shadow-xl dark:shadow-none"
        >
            <span class="material-symbols-outlined">
                {{ room.icon }}
            </span>
        </div>

        <div
            class="text-base md:text-xl font-semibold text-gray-600 flex items-start gap-2 peer group mb-2 justify-between md:pt-2 px-2 w-full"
            :class="!!room.isSystem ? 'pt-2' : 'pt-6'"
        >
            <router-link
                :to="{ name: 'TheRoomDetail', params: { roomId: room.id } }"
                class="hover:text-primary-600 transition-colors duration-600 flex items-start gap-2"
            >
                {{ roomName }}
                <span class="material-symbols-outlined text-2xl md:text-3xl lg:opacity-0 group-hover:opacity-100 group-hover:translate-x-2 text-primary-600/25 transition-all duration-600">
                    arrow_right_alt
                </span>
            </router-link>

            <div class="overflow-hidden">
                <div
                    v-if="!room.isSystem"
                    class="flex gap-3 text-xl md:text-2xl md:translate-x-20 group-hover/card:-translate-x-0 md:opacity-0 group-hover/card:opacity-100 transition-all duration-600"
                >
                    <button
                        type="button"
                        class="text-gray-500 hover:text-gray-400 dark:text-gray-600 transition-all duration-600 cursor-pointer flex"
                        v-tooltip="{
                            content: 'History',
                            container: 'body'
                        }"
                        @click="roomsStore.openHistoryModal(room.id)"
                    >
                        <span class="material-symbols-outlined">
                            history
                        </span>
                    </button>
                    <button
                        type="button"
                        class="text-gray-500 hover:text-gray-400 dark:text-gray-600 transition-all duration-600 cursor-pointer flex"
                        v-tooltip="{
                            content: 'Edit room',
                            container: 'body'
                        }"
                        @click="editRoom"
                    >
                        <span class="material-symbols-outlined">
                            edit
                        </span>
                    </button>

                    <v-dropdown
                        trap-focus
                        popper-class="md:w-[400px] px-4"
                        @show="onShow"
                        @hide="onHide"
                    >
                        <button
                            type="button"
                            class="text-gray-500 hover:text-red-500 dark:text-red-900 transition-all duration-600 cursor-pointer flex"
                            :class="{ 'md:opacity-100 text-red-500 dark:text-red-900': isOpen }"
                            v-tooltip="{
                                content: 'Delete room',
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
                                    Delete this room?
                                </template>

                                <template #desc>
                                    The plants linked to it will no longer be associated with any room.
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
                                        Keep This Room
                                    </base-button>
                                    <base-button
                                        btn-style="notRoundedMd"
                                        btn-size="sm"
                                        btn-color="danger"
                                        :btn-full-width="false"
                                        class="min-w-1/2"
                                        v-close-popper="true"
                                        @click="handleDeleteRoom"
                                    >
                                        Yes, Delete This Room
                                    </base-button>
                                </template>
                            </base-popover-content>
                        </template>
                    </v-dropdown>

                </div>
            </div>
        </div>

        <div
            class="min-h-[120px] lg:min-h-[200px] w-full rounded-xl relative flex flex-col grow"
            :class="{ 'items-center justify-center': !plants?.length && !isPending }"
        >
            <!-- to be styled and used later -->
            <!-- <div
                    class="size-3 rounded-full absolute top-0 left-0"
                    :style="{ 'backgroundColor': room.color }"
                >

                </div> -->
            <transition
                name="fade"
                mode="out-in"
            >
                <base-loader
                    v-if="isPending"
                    position-type="absolute"
                />
                <div
                    v-else-if="plants"
                    class="w-full p-0"
                    :class="{ 'h-full grow flex flex-col': dragStore.isDragging }"
                >
                    <v-draggable
                        :list="plants"
                        group="plants"
                        item-key="id"
                        tag="ul"
                        :data-room-id="props.room.id"
                        class="w-full rounded-xl relative flex flex-col gap-2 transition-all duration-300"
                        :class="[
                            plants?.length
                                ? 'p-2'
                                : 'flex flex-col items-start justify-start ',
                            isDragOver
                                ? 'bg-gray-200/25 dark:bg-gray-950/25'
                                : '',
                            dragStore.isDragging
                                ? 'min-h-[120px] lg:min-h-[calc(var(--spacing) * 2 + 160px)] grow p-2'
                                : ''
                        ]"
                        handle=".js-plant-handle"
                        filter=".js-water-btn, .js-actions-btn"
                        :prevent-on-filter="false"
                        :force-fallback="false"
                        :fallback-on-body="true"
                        fallback-class="dragging"
                        :animation="150"
                        ghost-class="drag-ghost"
                        chosen-class="drag-chosen"
                        drag-class="drag-dragging"
                        @dragenter.prevent="onDragEnterZone"
                        @dragleave.prevent="onDragLeaveZone"
                        @dragover.prevent
                        @add="onAdd"
                        @start="onStart"
                        @end="onEnd"
                    >
                        <template #item="{ element }">
                            <BasePlantListItem
                                :plant="element"
                                :room-id="props.room.id"
                                :data-plant-id="element.id"
                                class="cursor-move w-full"
                                :is-draggable="true"
                            />
                        </template>

                    </v-draggable>
                    <div
                        v-if="!dragStore.isDragging"
                        class="w-full text-center my-2"
                    >
                        <base-button
                            type="button"
                            class="py-1 px-2 md:pl-1 md:pr-0 inline-flex align-top items-center leading-none justify-center md:justify-start w-auto md:w-auto"
                            :btn-full-width="false"
                            btn-style="notRoundedMd"
                            btn-size="custom"
                            @click="plantsStore.openAddModal(props.room.id)"
                        >
                            <span class="material-symbols-outlined text-xl mr-1">
                                add
                            </span>
                            <span class="w-auto md:w-0 group-hover/card:w-[42px] overflow-hidden transition-all duration-400 text-sm flex">
                                Plant
                            </span>
                        </base-button>
                        <div
                            v-if="plants.length === 0"
                            class="text-xs text-gray-400 dark:text-gray-600 mt-2"
                        >
                            or <span class="text-gray-500 font-semibold">drag one</span> from another room
                        </div>
                    </div>
                    <div v-else-if="dragStore.isDragging">
                        <div class="absolute flex inset-0 items-center justify-center before:border-2 before:border-dashed before:border-gray-300 dark:before:border-gray-600 before:absolute before:inset-[3px] md:before:inset-0 before:rounded-xl pointer-events-none before:bg-gray-100/50 dark:before:bg-gray-700/50">
                            <div class="text-gray-400 dark:text-gray-500 text-center">
                                <span class="material-symbols-outlined text-[4rem] mb-2">
                                    potted_plant
                                </span>
                                <div class="text-xl">
                                    Drop your plant here
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';

import BaseButton from './BaseButtons/BaseButton.vue';
import BaseLoader from './BaseLoader.vue';
import BasePlantListItem from './BasePlantListItem.vue';
import BasePopoverContent from './BasePopoverContent.vue';


import { useDeleteData } from '../../composables/useDeleteData';
import { useGetData } from '../../composables/useGetData';

import vDraggable from 'vuedraggable';
import { useStorage } from '../../composables/useStorage';
import { useDragStore } from '../../stores/useDragStore';
import { usePlantsStore } from '../../stores/usePlantsStore';
import { useRoomsStore } from '../../stores/useRoomsStore';
import { useScrollStore } from '../../stores/useScrollStore';


const roomsStore = useRoomsStore()
const plantsStore = usePlantsStore()
const scrollStore = useScrollStore()

const props = defineProps({
    room: {
        type: Object,
        required: true
    },
})

const {
    error,
    isPending,
    items: plants
} = useGetData(`rooms/${props.room.id}/plants`)

const {
    error: errorDelete,
    isPending: isPendingDelete,
    deleteData,
    movePlants,
    movePlant
} = useDeleteData()

const {
    error: errorDeleteImage,
    isPending: isPendingDeleteImage,
    deleteImageByUrl
} = useStorage()

const dragStore = useDragStore()

const isDragOver = ref(false)
const draggedItemId = ref(null)
const sourceRoomId = ref(null)

const onStart = (e) => {
    draggedItemId.value = e.item.dataset.plantId
    sourceRoomId.value = e.from.dataset.roomId
    isDragOver.value = false
    dragStore.startDrag(e.item.dataset.plantId)
    sourceRoomId.value = e.from.dataset.roomId
}

const onEnd = () => {
    isDragOver.value = false
    dragStore.endDrag()
    isDragOver.value = false
    draggedItemId.value = null
    sourceRoomId.value = null
}

const onDragEnterZone = (e) => {
    if (!isDragOver.value) {
        isDragOver.value = true
    }
}
const onDragLeaveZone = (e) => {
    const related = e.relatedTarget
    if (!related || !e.currentTarget.contains(related)) {
        isDragOver.value = false
    }
}

const onAdd = async (e) => {
    isDragOver.value = false
    
    const toRoomId = e.to.dataset.roomId
    const fromRoomId = e.from.dataset.roomId
    const plantId = e.item.dataset.plantId

    if (!plantId || fromRoomId === toRoomId) return

    await movePlant(fromRoomId, toRoomId, plantId)

    await nextTick()
}

watch(() => plants.value?.length, () => {
  if (!dragStore.isDragging) return
  dragStore.endDrag()
})

const editRoom = () => {
    roomsStore.openEditModal(props.room.id)
}

const isOpen = ref(false)

const onShow = () => (isOpen.value = true)
const onHide = () => (isOpen.value = false)

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))


const isBeingDeleted = ref(false)

const handleDeleteRoom = async () => {
    const oldPhotoUrl = props.room?.imgSrc || null
    const el = document.querySelector(`[data-room-id="${props.room.id}"]`)
    
    roomsStore.hideRoomTemp(props.room.id)

    if (el) {
        el.classList.add('animate-popOut', 'transition-discrete', 'fill-mode-forwards')
        await delay(1000)
    }

    roomsStore.hideRoomTemp('unassigned')
    await movePlants(props.room.id, 'unassigned')
    roomsStore.showRoom('unassigned')


    await deleteData(props.room.id, 'rooms')

    if (oldPhotoUrl) {
        await deleteImageByUrl(oldPhotoUrl)
    }

    roomsStore.showRoom(props.room.id)

}

const roomName = computed(() => props.room.name === 'Unassigned' ? 'Unassigned plants' : props.room.name)


const emit = defineEmits(['visibility-change'])

const isVisible = computed(() =>
    !props.room.isSystem || (props.room.isSystem && plants.value?.length > 0)
)

onMounted(() => emit('visibility-change', isVisible.value))

onUnmounted(() => emit('visibility-change', false))

watch(isVisible, (val) => emit('visibility-change', val))

watch(
    () => scrollStore.scrollTarget,
    async (newVal) => {
        if (newVal.type !== 'plant' || !newVal.plantId) return

        await nextTick()

        const el = document.querySelector(`[data-plant-id="${newVal.plantId}"]`)

        if (el) {
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    el.classList.add('animate-pop')
                    setTimeout(() => el.classList.remove('animate-pop'), 1000)
                    observer.disconnect()
                }
            }, { threshold: 0.6 })

            observer.observe(el)
            el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }

        scrollStore.clearScrollTarget()
    },
    { deep: true }
)

</script>

<style lang="scss">
.dragging {
    opacity: 0.9;
    transform: scale(1.02);
    // background-color: rgba(255, 255, 255, 0.95);
    // background-color: red;
    // box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 9999;
}

.draggable-container {
    touch-action: none;
}

.draggable-item {
    will-change: transform;
    transform: translateZ(0);
}
</style>