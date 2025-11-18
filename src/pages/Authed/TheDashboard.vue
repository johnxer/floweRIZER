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
                    @click="roomsStore.openAddModal"
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
                        @click="roomsStore.openAddModal"
                    >
                        <span class="material-symbols-outlined text-2xl">
                            add
                        </span>
                        New room
                    </button>
                </transition>
            </div>



            <!-- TO BE STYLED and make work -->
            <!-- <div v-else>
                    No rooms yet
                    <br />
                    Add a new roomw
                    <br />
                    <base-button
                        @click="roomsStore.openAddModal"
                        btn-style="notRoundedMd"
                        btn-size="sm"
                        :btn-full-width="false"
                    >
                        Add a new room
                    </base-button>
                    
                </div> -->

        </transition>

        <the-modals />

    </base-container>
</template>

<script setup>


import { computed, nextTick, watch } from 'vue';

import BaseButton from '../../components/Base/BaseButtons/BaseButton.vue';
import BaseContainer from '../../components/Base/BaseContainer.vue';
import BaseLoader from '../../components/Base/BaseLoader.vue';
import BaseRoom from '../../components/Base/BaseRoom.vue';

import StatsBox from '../../components/Stats/StatsBox.vue';
import TheModals from '../../components/TheModals.vue';

import { ref } from 'vue';
import { useGetAllPlants, useGetData } from '../../composables/useGetData';
import { useRoomsStore } from '../../stores/useRoomsStore';
import { useScrollStore } from '../../stores/useScrollStore';

const {
    error,
    isPending,
    items: rooms
} = useGetData('rooms')

const roomsStore = useRoomsStore()

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

        const observer = new IntersectionObserver((entries, obs) => {
            const entry = entries[0]

            if (entry.isIntersecting) {
                el.classList.add('animate-pop')
                setTimeout(() => el.classList.remove('animate-pop'), 1000)
                observer.disconnect()
            }
        }, { threshold: 0.6 })

        observer.observe(el)

        scrollStore.clearScrollTarget()
    },
    { deep: true }
)

const {
    items: plants,
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