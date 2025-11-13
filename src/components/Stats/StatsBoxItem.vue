<template>
    <div class="flex flex-col items-center">
        <div class="text-primary-700 flex items-center gap-2 mb-2">
            <span class="material-symbols-outlined text-3xl">
                {{ props.icon }}
            </span>
            <base-loader v-if="props.isPending" loader-size="xs"/>
            <span v-else class="text-xl">
                {{ props.value }}
            </span>
        </div>
        <div class="text-gray-400 dark:text-gray-500 text-xs md:text-sm">
            {{ props.label }}
        </div>
    </div>
</template>

<script setup>

import BaseLoader from '../Base/BaseLoader.vue';

const props = defineProps({
    icon: {
        type: String,
        required: true,
    },
    value: {
        type: Number,
        required: true,
    },
    label: {
        type: String,
        required: true,
    },
    isPending: {
        type: Boolean,
        required: false,
        default: false
    }
})

</script>


<style lang="scss" scoped></style>