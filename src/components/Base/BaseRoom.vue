<template>
    <div>
        <div class="text-xl font-semibold text-gray-600 flex items-start justify-center gap-2">
            <router-link 
                :to="{ name: 'TheRoom', params: { roomId: room.id } }"
                class="hover:text-primary-600 transition-colors peer order-2"
            >
                {{ room.name }}
            </router-link>
            <vue-popper
                v-if="room.desc.length !== 0"
                hover
                arrow
                offsetDistance="0"
                class="text-primary-500/50 cursor-help peer-hover:text-primary-600 transition-colors"
            >
                <button class="text-3xl relative top-[-2px] cursor-help">
                    <span class="material-symbols-outlined">
                        {{ room.icon }}
                    </span>
                </button>
                <template #content>
                    <div class="text-xs max-w-[300px] font-normal">
                        {{ room.desc }}
                    </div>
                </template>
            </vue-popper>
            <span
                v-else
                class="material-symbols-outlined text-3xl relative top-[-2px] text-primary-500/50 peer-hover:text-primary-600"
            >
                {{ room.icon }}
            </span>
            <span class="material-symbols-outlined text-3xl order-3 opacity-0 peer-hover:opacity-100 peer-hover:translate-x-2 transition-all text-primary-600/25">
                arrow_right_alt
            </span>


        </div>
        <div
            class="min-h-[200px] w-full"
            :class="{ 'flex items-center': !room.plants }"
        >
            <!-- shadow-lg border border-gray-200 rounded-xl -->

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
                    No plants in the room yet...
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

import VuePopper from "vue3-popper";

import BasePlantListItem from './BasePlantListItem.vue';

defineProps({
    room: {
        type: Object,
        required: true
    }
})

</script>

<style lang="scss" scoped></style>