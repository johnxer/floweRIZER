<template>
    <div class="rounded-xl p-2 md:p-4 bg-white dark:bg-card shadow-box">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-6 md:gap-x-6 mad:gap-y-0 items-start">
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
                icon="home_and_garden"
                :value="avgPlantsPerRoom"
                label="Avg. plants per room"
                :is-pending="isPending"
            />
            <stats-box-item
                icon="yard"
                :value="plantsInUnassigned"
                label="Total unassigned plants"
                :is-pending="isPending"
            />
        </div>
    </div>
</template>

<script setup lang="ts">

import { useGetAllPlants, useGetData } from '@/composables';
import { useRoomsStore } from '@/stores/useRoomsStore';
import { computed } from 'vue';
import StatsBoxItem from './StatsBoxItem.vue';


const roomsStore = useRoomsStore()

const {
    error: errorPlants,
    isPending: isPendingPlants,
    data: plants,
} = useGetAllPlants()

const {
    data
} = useGetData(`rooms/unassigned/plants`)


const roomsTotal = computed(() => roomsStore.rooms.filter(r => r.id !== 'unassigned').length)
const plantsInUnassigned = computed(() => data.value?.length || 0)

const plantsTotal = computed(() => plants.value?.length - plantsInUnassigned.value || 0)

const isPending = computed(() => isPendingPlants.value)

const avgPlantsPerRoom = computed(() => roomsTotal.value !== 0 ? Math.round((plantsTotal.value / roomsTotal.value + Number.EPSILON) * 100) / 100 : 0)

</script>

<style lang="scss" scoped></style>