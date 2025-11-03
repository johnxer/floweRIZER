<template>
    <h2
        class="text-center font-bold"
        :class="[
            isDefaultTitle ? 'text-gray-300 dark:text-gray-600 text-2xl lg:text-3xl hidden md:block' : 'text-shadow-lg text-white dark: text-white/80 text-3xl md:text-4xl',
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