<template>
    <button
        type="button"
        v-tooltip="{
            content: tooltipContent,
            placement: 'left',
        }"
        class="fixed right-6 size-16 md:size-14 bg-primary-500 hover:bg-primary-600 transition-all duration-600 flex flex-col items-center justify-center rounded-lg shadow-xl cursor-pointer text-white dark:text-primary-800 z-4 hover:scale-110"
    >
        <slot />
    </button>
</template>

<script setup>

defineProps({
    tooltipContent: {
        type: String,
        required: false
    }
})
</script>

<style lang="scss" scoped></style>