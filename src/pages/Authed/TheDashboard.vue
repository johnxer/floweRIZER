<template>
    <base-container>
        <transition
            name="fade"
            mode="out-in"
        >
            <base-loader
                v-if="isPending"
                :has-bg="true"
                position="fixed"
            />
            <div
                v-else-if="showPlaceholder"
                class="max-w-[300px] mx-auto text-center"
            >
                <h2 class="text-xl mb-4 text-gray-700 dark:text-gray-500">
                    You have no rooms yet...
                </h2>
                <Button
                    @click="uiStore.openModal('room')"
                    class="inline-flex gap-1"
                >
                    <span class="material-symbols-outlined text-2xl">
                        add
                    </span>
                    Add a new room
                </Button>
            </div>
            <div v-else>
                <stats-box class="mb-6" />
                <div class="mb-6 flex gap-2 justify-end items-center">
                    <button
                        v-tooltip="{
                            content: multiSelectTootlipText,
                            container: 'body'
                        }"
                        type="button"
                        class="relative transition-colors duration-600 inline-flex align-top p-2 cursor-pointer hover:text-gray-600 dark:text-gray-600 hover:dark:text-primary-600 text-3xl"
                        :class="uiStore.isMultiSelectEnabled ? 'text-primary' : 'text-gray-400'"
                        @click="toggleMultiSelected"
                    >
                        <span class="material-symbols-outlined">
                            flaky
                        </span>
                    </button>
                    <transition name="fade">
                        <div v-if="uiStore.isMinOnePlantSelected">
                            <button
                                v-tooltip="{
                                    content: 'Delete selected plants',
                                    container: 'body'
                                }"
                                type="button"
                                class="relative transition-colors duration-600 inline-flex align-top p-2 cursor-pointer text-gray-400 hover:text-gray-600 dark:text-gray-600 hover:dark:text-primary-600 text-3xl"
                                @click="multiPlantDelete"
                            >
                                <span class="material-symbols-outlined">
                                    delete
                                </span>
                            </button>
                        </div>
                    </transition>
                    <div class="w-full md:w-[180px] flex md:inline-flex align-top">
                        <Select
                            v-model="selectedRoom"
                            @update:model-value="performScroll"
                        >
                            <SelectTrigger class="w-full">
                                <SelectValue placeholder="Jump to room..." />
                            </SelectTrigger>
                            <SelectContent class="animate-popper-slide">
                                <SelectGroup>
                                    <SelectItem
                                        :show-indicator-icon="false"
                                        v-for="room in sortedRooms"
                                        :key="room.id"
                                        :value="room.id"
                                    >
                                        {{ room.name }}
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div class="grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-10 lg:gap-8 items-start">
                    <transition-group name="fade">
                        <base-room
                            v-for="room in sortedRooms"
                            :key="room.id"
                            :room="room"
                        />
                    </transition-group>
                </div>

                <div class=" md:hidden text-end mt-2">
                    <Button
                        type="button"
                        class="inline-flex align-top items-center justify-end py-2 px-2 gap-1 text-primary"
                        variant="link"
                        size="lg"
                        @click="uiStore.openModal('room')"
                    >
                        <span class="material-symbols-outlined text-lg">
                            add
                        </span>
                        New room
                    </Button>
                </div>
            </div>
        </transition>
        <the-modals />
    </base-container>
</template>

<script setup>
import { computed, nextTick, ref, watch } from 'vue';

import BaseContainer from '@/components/base/BaseContainer.vue';
import BaseLoader from '@/components/base/BaseLoader.vue';
import BaseRoom from '@/components/features/rooms/RoomCard.vue';

import StatsBox from '@/components/stats/StatsBox.vue';
import TheModals from '@/components/TheModals.vue';

import { Button } from '@/components/ui/button';

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';

import { useRoomsStore } from '@/stores/useRoomsStore';
import { useScrollStore } from '@/stores/useScrollStore';
import { useUIStore } from '@/stores/useUIStore';

import { observeVisibility } from '@/utils';

import { useDeleteData, useFetchDocument, useGetAllPlants, useGetData, useStorage } from '@/composables';


const {
    error,
    isPending,
    data: rooms
} = useGetData('rooms')

const {
    error: errorDeleteData,
    isPending: isPendingDeleteData,
    deleteData
} = useDeleteData()

const {
    deleteImageByUrl
} = useStorage()

const {
    fetchDocument,
    error: errorFetchDocument,
    isPending: isPendingFetchDocument
} = useFetchDocument()

const roomsStore = useRoomsStore()
const uiStore = useUIStore()

const hasRooms = ref(false);
const selectedRoom = ref('');

watch(() => rooms.value, newVal => {
    roomsStore.rooms = newVal;
    if (newVal.length > 1) {
        hasRooms.value = true;
    } else {
        hasRooms.value = false;
    }
})

const sortedRooms = computed(() => {
    if (!rooms.value) return []

    const systemRoom = rooms.value?.find(r => r.isSystem)

    const normalRooms = rooms.value?.filter(r => !r.isSystem) || []

    return systemRoom ? [systemRoom, ...normalRooms] : normalRooms
})

const scrollStore = useScrollStore()


watch(
    () => scrollStore.scrollTarget,
    async (newVal) => {
        if (newVal.type !== 'room' || !newVal.roomId) return

        await nextTick()

        const el = document.querySelector(`[data-room-id="${newVal.roomId}"]`)

        if (!el) return

        el.scrollIntoView({ behavior: 'smooth', block: 'start' })

        await observeVisibility(el)

        el.classList.add('animate-pop')
        setTimeout(() => el.classList.remove('animate-pop'), 1000)

        scrollStore.clearScrollTarget()
    },
    { deep: true }
)

const {
    error: errorPlants,
    isPending: isPendingPlants,
    data: plants,
} = useGetAllPlants()

const hasPlants = ref(false)

watch(plants, newVal => {
    if (!newVal.length) {
        hasPlants.value = false
    } else {
        hasPlants.value = true
    }
})

const showPlaceholder = computed(() => !hasRooms.value && !hasPlants.value)

const performScroll = async (roomId) => {
    const el = document.querySelector(`[data-room-id="${roomId}"]`)

    if (!el) return

    const y = el.getBoundingClientRect().top + window.scrollY - uiStore.headerHeight - 15; // 15px is for offset to keep the circle with icon visible

    window.scrollTo({
        top: y,
        behavior: 'smooth'
    });

    scrollStore.clearScrollTarget()

    selectedRoom.value = ''
}

const toggleMultiSelected = () => {
    uiStore.isMultiSelectEnabled = !uiStore.isMultiSelectEnabled

    if (uiStore.isMultiSelectEnabled) uiStore.clearSelection()
}

const multiSelectTootlipText = computed(() => uiStore.isMultiSelectEnabled ? 'Disable multiple select' : 'Enable multiple select')

const multiPlantDelete = async () => {
    for (let i = 0; i < uiStore.plantSelectedList.length; i++) {

        const plant = await fetchDocument(`rooms/${uiStore.plantSelectedList[i].roomId}/plants/${uiStore.plantSelectedList[i].plantId}`)


        const plantLogImages = plant?.log?.filter(l => l.action === 'custom photo').map(l => l.newVal) ?? []

        const filesArray = [
            ...(plant?.imgSrc ? [plant.imgSrc] : []),
            ...plantLogImages

        ]

        console.log(filesArray)

        const deleteImages = async () => {
            for (let i = 0; i < filesArray.length; i++) {
                await deleteImageByUrl(filesArray[i])
            }
            return true
        }

        const filesDeleted = await deleteImages();

        if (!filesDeleted) {
            console.log('files not deleted')
            return;
        }

        const success = await deleteData(uiStore.plantSelectedList[i].plantId, `rooms/${uiStore.plantSelectedList[i].roomId}/plants`)


        if (!success) {
            uiStore.clearSelection()
            console.log('all done')
            return
        }
    }
}

</script>

<style lang="scss" scoped></style>