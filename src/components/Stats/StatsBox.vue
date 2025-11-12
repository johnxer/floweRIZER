<template>
    <div class="rounded-xl p-2 md:p-4 bg-white shadow-box">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 items-start">
            <stats-box-item
                icon="home"
                value="12"
                label="Total rooms monitored"
            />
            <stats-box-item
                icon="potted_plant"
                value="12"
                label="Total plants organized"
            />
            <stats-box-item
                icon="home_and_garden"
                value="12"
                label="Avg. plants per room"
            />
            <stats-box-item
                icon="water_drop"
                value="12"
                label="Avg. days between watering"
            />
        </div>
    </div>
</template>

<script setup>

import StatsBoxItem from './StatsBoxItem.vue';

</script>

<style lang="scss" scoped></style>