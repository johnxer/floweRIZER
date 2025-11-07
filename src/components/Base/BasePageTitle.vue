<template>
    <h2
        class="font-semibold inline-flex align-top items-center gap-4"
        :class="[
            isDefaultTitle ? 'text-gray-400 dark:text-gray-600 text-xl lg:text-2xl' : 'text-shadow-lg text-white dark:text-white/80 text-3xl md:text-4xl',
            { 'mb-10': isDefaultTitle }
        ]"
    >
        <slot />
    </h2>
</template>

<script setup>

defineProps({
    isDefaultTitle: {
        type: Boolean,
        required: false,
        default: true
    }

})



</script>

<style lang="scss" scoped></style>