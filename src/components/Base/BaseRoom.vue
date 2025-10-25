<template>
    <div>
        <div class="text-xl font-semibold text-gray-600 flex items-start justify-center gap-2">
            <span class="material-symbols-outlined text-3xl relative top-[-2px] text-primary-500/50">
                {{ room.icon }}
            </span>
            {{ room.name }} - {{ room.id }}
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

import BasePlantListItem from './BasePlantListItem.vue';

defineProps({
    room: {
        type: Object,
        required: true
    }
})

</script>

<style lang="scss" scoped></style>