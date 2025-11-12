<template>
    <base-container>
        <transition
            name="fade"
            mode="out-in"
        >
            <base-loader
                v-if="isPending"
                class="flex items-center justify-center absolute top-[60px] md:bottom-[64px] h-[calc(100vh-60px-64px)] inset-x-[0] w-screen"
            />
            <div
                v-else
                class="grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-10 lg:gap-8 items-start"
            >
                <base-room
                    v-for="room in sortedRooms"
                    :key="room.id"
                    :room="room"
                />
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

import BaseContainer from '../../components/Base/BaseContainer.vue';
import BaseLoader from '../../components/Base/BaseLoader.vue';
import BaseRoom from '../../components/Base/BaseRoom.vue';

import TheModals from '../../components/TheModals.vue';

import { useGetData } from '../../composables/useGetData';
import { useScrollStore } from '../../stores/useScrollStore';


// const mobileStore = useMobileStore()

const {
    error,
    isPending,
    items: rooms
} = useGetData('rooms')

const sortedRooms = computed(() => {
    if (!rooms.value) return []

    const systemRoom = rooms.value?.find(r => r.isSystem)
    console.log(systemRoom)

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

<style lang="scss" scoped></style>