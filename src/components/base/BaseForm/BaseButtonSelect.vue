<template>
    <button
        type="button"
        class="flex flex-col items-center justify-center p-2 rounded-lg border-2 transition-all duration-600 hover:bg-gray-50 dark:hover:bg-neutral-800/50 cursor-pointer"
        :class="[
            props.selected
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600'
                : 'border-gray-200 dark:border-neutral-700 text-gray-500 dark:text-neutral-600'
        ]"
    >
        <span class="material-symbols-outlined text-2xl mb-1">
            {{ icon.icon }}
        </span>
        <span class="text-xs text-center truncate w-full">
            {{ icon.label }}
        </span>
    </button>
</template>

<script setup>
const props = defineProps({
    icon: {
        type: Object,
        required: true
    },
    selected: {
        type: Boolean,
        required: true
    }
})
</script>
