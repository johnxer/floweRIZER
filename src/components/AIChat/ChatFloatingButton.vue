<template>
    <button
        type="button"
        class="fixed bottom-[80px] md:bottom-6 right-6 size-14 bg-primary-500 hover:bg-primary-600 transition-all duration-600 flex items-center justify-center rounded-2xl shadow-xl text-2xl cursor-pointer text-white dark:text-primary-800"
        v-tooltip="{
            content: tooltipContent,
            placement: 'left',
        }"
    >
        <span class="material-symbols-outlined">
            chat_bubble
        </span>
    </button>
</template>

<script setup>

defineProps({
    tooltipContent: {
        type: String,
        required: true
    }
})

</script>

<style lang="scss" scoped></style>