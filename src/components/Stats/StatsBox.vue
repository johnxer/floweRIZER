<template>
    <div class="rounded-xl p-2 md:p-4 bg-white dark:bg-gray-900 shadow-box">
        

        <div
            
            class="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 items-start"
        >
            <!-- <base-loader v-if="roomsStore.isPendingRooms" loader-size="sm"/> -->
            <stats-box-item
                icon="home"
                :value="roomsTotal"
                label="Total rooms monitored"
            />
            <!-- <base-loader v-if="isPendingPlants" loader-size="sm"/> -->
            <stats-box-item
                icon="potted_plant"
                :value="plantsTotal"
                label="Total plants organized"
                :is-pending="isPending"
            />
            <!-- <base-loader v-if="isPendingPlants" loader-size="sm"/> -->
            <stats-box-item
                class="hidden md:flex"
                icon="home_and_garden"
                :value="avgPlantsPerRoom"
                label="Avg. plants per room"
                :is-pending="isPending"
            />
            <!-- <stats-box-item
                icon="water_drop"
                :value="12"
                label="Avg. days between watering"
            /> -->
        </div>
    </div>
</template>

<script setup>

import { computed } from 'vue';
import { useGetAllPlants } from '../../composables';
import { useRoomsStore } from '../../stores/useRoomsStore';
import StatsBoxItem from './StatsBoxItem.vue';


const roomsStore = useRoomsStore()

const {
    error: errorPlants,
    isPending: isPendingPlants,
    data: plants,
} = useGetAllPlants()

const roomsTotal = computed(() => roomsStore.rooms.filter(r => r.id !== 'unassigned').length)

const plantsTotal = computed(() => plants.value?.length || 0)

const isPending = computed(() => isPendingPlants.value)

const avgPlantsPerRoom = computed(() => Math.round((plantsTotal.value / roomsTotal.value + Number.EPSILON) * 100) / 100)

</script>

<style lang="scss" scoped></style>