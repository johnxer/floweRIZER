<template>
    <div>
        <div class="bg-gray-50 px-4 py-3 sm:flex sm:px-6 dark:bg-gray-900 text-xl md:text-2xl border-b border-gray-200 text-gray-700 dark:text-gray-500 dark:border-gray-800">
          <slot name="modalTitle" />
        </div>
        <div class="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <slot />
        </div>
    </div>
</template>

<script setup>

</script>

<style lang="scss" scoped></style>