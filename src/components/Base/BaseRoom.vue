<template>
    <div>
        <div class="text-xl font-semibold text-gray-600 flex items-start justify-center gap-2">
            <router-link
                :to="{ name: 'TheRoomDetail', params: { roomId: room.id } }"
                class="hover:text-primary-600 transition-colors duration-600 peer order-2"
            >
                {{ room.name }}
            </router-link>
            <v-tooltip
                :disabled="!room.desc"
                class="relative top-[-2px] text-primary-500/50 peer-hover:text-primary-600 transition-colors duration-600"
            >
                <template #popper>
                    {{ room.desc }}
                </template>
                <span class="material-symbols-outlined text-3xl">
                    {{ room.icon }}
                </span>
            </v-tooltip>
            <span class="material-symbols-outlined text-3xl order-3 opacity-0 peer-hover:opacity-100 peer-hover:translate-x-2 text-primary-600/25 transition-all duration-600">
                arrow_right_alt
            </span>


        </div>
        <div
            class="min-h-[200px] w-full"
            :class="{
                'flex items-center border border-gray-200 rounded-xl': !room.plants
            }"
        >
            <div v-if="room.plants">
                <transition-group
                    name="fade"
                    tag="ul"
                    class="p-2 space-y-4"
                >
                    <base-plant-list-item
                        v-for="plant in room.plants"
                        :key="plant.id"
                        :plant="plant"
                    />
                </transition-group>
            </div>
            <div
                v-else
                class="w-full"
            >
                <div class="text-center">
                    <!-- <div class="text-sm text-blue-400/50 flex flex-col items-center justify-center mb-6">
                        <span class="material-symbols-outlined text-3xl">
                            info
                        </span>
                        <span>
                        No plants in the room yet...
                        </span>
                    </div> -->
                    <button class="bg-primary text-white border border-2 border-primary rounded-full px-3 py-1 text-sm cursor-pointer hover:bg-transparent hover:text-primary transition-colors mb-2">
                        Add a new plant
                    </button>
                    <div class="text-xs text-gray-400">
                        or drag one from another room
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

import BasePlantListItem from './BasePlantListItem.vue';

defineProps({
    room: {
        type: Object,
        required: true
    }
})

</script>

<style lang="scss" scoped></style>