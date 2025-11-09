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
            <div v-else>
                <div
                    v-if="existsRoom"
                    class="grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-10 lg:gap-8 items-start"
                >
                    <base-room
                        v-for="room in sortedRooms"
                        :key="room.id"
                        :room="room"
                    />
                </div>
                <div v-else>
                    No rooms yet

                    Add a new roomw

                    <base-button
                        @click="roomStore.openAddModal"
                        btn-style="notRoundedMd"
                        btn-size="sm"
                        :btn-full-width="false"
                    >
                        Add a new room
                    </base-button>
                </div>
            </div>
        </transition>

        <the-modals />
        
    </base-container>
</template>

<script setup>


import { computed } from 'vue';

import BaseButton from '../../components/Base/BaseButton.vue';
import BaseContainer from '../../components/Base/BaseContainer.vue';
import BaseLoader from '../../components/Base/BaseLoader.vue';
import BaseRoom from '../../components/Base/BaseRoom.vue';

import TheModals from '../../components/TheModals.vue';

import { useGetData } from '../../composables/useGetData';


const {
    error,
    isPending,
    items: rooms
} = useGetData('rooms')

const sortedRooms = computed(() => {
    if (!rooms.value) return []

    const systemRoom = rooms.value?.find(r => r.isSystem)
    const normalRooms = rooms.value?.filter(r => !r.isSystem) || []

    return systemRoom ? [systemRoom, ...normalRooms] : normalRooms
})

const existsRoom = computed(() => rooms.value.length > 1) // Unassigned room is always present but hidden

</script>

<style lang="scss" scoped></style>