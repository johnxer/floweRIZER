<template>
    <base-container>
        <transition
            name="fade"
            mode="out-in"
        >
            <base-loader
                v-if="isPending"
                class="static"
            />
            <div
                v-else-if="rooms"
                class="grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-10 lg:gap-8 items-start"
            >
                <base-room
                    v-for="room in sortedRooms"
                    :key="room.id"
                    :room="room"
                />
            </div>
        </transition>
    </base-container>
</template>

<script setup>


import { computed } from 'vue';
import BaseContainer from '../../components/Base/BaseContainer.vue';
import BaseLoader from '../../components/Base/BaseLoader.vue';
import BaseRoom from '../../components/Base/BaseRoom.vue';

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


</script>

<style lang="scss" scoped></style>