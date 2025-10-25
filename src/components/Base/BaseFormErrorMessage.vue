<template>
    <div class="bg-red-500 dark:bg-red-900 text-white rounded-xl px-3 py-2 mb-4 text-sm flex gap-2 items-start">
        <span class="material-symbols-outlined transition text-white text-base relative top-[1px]">
            error
        </span>
        {{ errorMessage }}
    </div>
</template>

<script setup>

    defineProps({
        errorMessage: {
            type: String,
            required: true
        }
    })

</script>

<style lang="scss" scoped></style>