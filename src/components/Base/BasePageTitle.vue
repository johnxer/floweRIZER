<template>
    <h2
        class="text-center font-bold"
        :class="[
            isDefaultTitle ? 'text-gray-300 dark:text-gray-600 text-2xl lg:text-3xl' : 'text-shadow-lg text-white text-3xl md:text-4xl',
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