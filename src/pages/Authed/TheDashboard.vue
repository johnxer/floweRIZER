<template>
    <base-container>

        <transition
            name="fade"
            mode="out-in"
        >
            <base-loader
                v-if="isPending"
                class="flex items-center justify-center absolute top-[60px] md:bottom-[64px] h-[calc(100vh-60px-64px)] inset-x-[0] w-screen"
                loader-size="lg"
            />
            <div
                v-else-if="showPlaceholder"
                class="max-w-[300px] mx-auto text-center"
            >
                <h2 class="text-xl mb-4 text-gray-700 dark:text-gray-500">
                    You have no rooms yet...
                </h2>
                <base-button
                    @click="uiStore.openModal('room')"
                    btn-style="notRoundedMd"
                    btn-size="base"
                    :btn-full-width="false"
                    class="inline-flex gap-1"
                >
                    <span class="material-symbols-outlined text-2xl">
                        add
                    </span>
                    Add a new room
                </base-button>
            </div>
            <div v-else>
                <stats-box class="mb-10" />
                <div class="grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-10 lg:gap-8 items-start">
                    <transition-group name="fade">
                        <base-room
                            v-for="room in sortedRooms"
                            :key="room.id"
                            :room="room"
                        />
                    </transition-group>
                </div>
                <transition name="fade">
                    <button
                        type="button"
                        class="md:hidden mt-2 flex items-center justify-end py-2 px-2 gap-1 w-full text-primary-500"
                        @click="uiStore.openModal('room')"
                    >
                        <span class="material-symbols-outlined text-2xl">
                            add
                        </span>
                        New room
                    </button>
                </transition>
            </div>
        </transition>
        <the-modals />
    </base-container>
</template>

<script setup>

import { computed, nextTick, ref, watch } from 'vue';

import BaseButton from '@/components/base/BaseButtons/BaseButton.vue';
import BaseContainer from '@/components/base/BaseContainer.vue';
import BaseLoader from '@/components/base/BaseLoader.vue';
import BaseRoom from '@/components/features/rooms/RoomCard.vue';

import StatsBox from '@/components/stats/StatsBox.vue';
import TheModals from '@/components/TheModals.vue';

import { useRoomsStore } from '@/stores/useRoomsStore';
import { useScrollStore } from '@/stores/useScrollStore';
import { useUIStore } from '@/stores/useUIStore';

import { useGetAllPlants, useGetData } from '@/composables';

import { observeVisibility } from '@/utils';

const {
    error,
    isPending,
    data: rooms
} = useGetData('rooms')

const roomsStore = useRoomsStore()
const uiStore = useUIStore()

const hasRooms = ref(false);

watch(() => rooms.value, newVal => {
    roomsStore.rooms = newVal;
    if (newVal.length > 1) {
        hasRooms.value = true;
    } else {
        hasRooms.value = false;
    }
    console.log('rooms', newVal.length)
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

        el.scrollIntoView({ behavior: 'smooth', block: 'center' })

        await observeVisibility(el)

        el.classList.add('animate-pop')
        setTimeout(() => el.classList.remove('animate-pop'), 1000)

        scrollStore.clearScrollTarget()
    },
    { deep: true }
)

const {
    data: plants,
    error: errorPlants,
    isPending: isPendingPlants
} = useGetAllPlants()


const hasPlants = ref(false)

watch(plants, newVal => {
    if (!newVal.length) {
        console.log('No plants')
        hasPlants.value = false
    } else {
        console.log('plants', newVal)
        hasPlants.value = true
    }
})

const showPlaceholder = computed(() => !hasRooms.value && !hasPlants.value)


</script>

<style lang="scss" scoped></style>