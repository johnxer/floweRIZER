<template>
    <div>
        <div class="text-xl font-semibold text-gray-600 flex items-start justify-center gap-2">
            <router-link
                :to="{ name: 'TheRoomDetail', params: { roomId: room.id } }"
                class="hover:text-primary-600 transition-colors duration-600 peer order-2"
            >
                {{ room.name }}
            </router-link>
            <span
                class="material-symbols-outlined text-3xl relative top-[-2px] text-primary-500/50 peer-hover:text-primary-600 transition-colors duration-600 cursor-help"
                v-tooltip="{
                    content: room.desc,
                    disabled: !room.desc,
                }"
            >
                {{ room.icon }}
            </span>
            <span class="material-symbols-outlined text-3xl order-3 opacity-0 peer-hover:opacity-100 peer-hover:translate-x-2 text-primary-600/25 transition-all duration-600">
                arrow_right_alt
            </span>


        </div>
        <div
            class="min-h-[120px] lg:min-h-[200px] w-full"
            :class="{
                'flex items-center border border-gray-200 dark:border-gray-800 rounded-xl': !room.plants
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
                    <router-link
                        class="border border-2 border-primary rounded-full px-3 py-1 text-sm cursor-pointer bg-primary text-white dark:text-primary-800 hover:bg-transparent hover:text-primary transition-all duration-600 mb-2 hover:-translate-y-1 font-semibold inline-block align-top"
                        :to="{name: 'AddPlant'}"
                    >
                        Add a new plant
                    </router-link>
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