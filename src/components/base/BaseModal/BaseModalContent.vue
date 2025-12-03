<template>
    <div>
        <div class="bg-gray-50 px-4 py-3 sm:flex sm:px-6 dark:bg-neutral-900 text-xl md:text-2xl border-b border-gray-200 text-foreground dark:border-neutral-800">
            <h4 class="flex">
                <slot name="modalTitle" />
            </h4>
        </div>
        <div class="px-4 pt-5 pb-4 sm:p-6 sm:pb-6">
            <slot />
        </div>
    </div>
</template>

<script setup>

</script>

<style lang="scss" scoped></style>