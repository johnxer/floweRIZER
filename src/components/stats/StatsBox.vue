<template>
    <div class="rounded-xl p-2 md:p-4 bg-white dark:bg-gray-900 shadow-box">
        <div class="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 items-start">
            <stats-box-item
                icon="home"
                :value="roomsTotal"
                label="Total rooms monitored"
            />
            <stats-box-item
                icon="potted_plant"
                :value="plantsTotal"
                label="Total plants organized"
                :is-pending="isPending"
            />
            <stats-box-item
                class="hidden md:flex"
                icon="home_and_garden"
                :value="avgPlantsPerRoom"
                label="Avg. plants per room"
                :is-pending="isPending"
            />
        </div>
    </div>
</template>

<script setup>

import { useGetAllPlants } from '@/composables';
import { useRoomsStore } from '@/stores/useRoomsStore';
import { computed } from 'vue';
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