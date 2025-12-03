<template>
    <div class="p-4">
        <div
            v-if="showTitleSlot"
            class="text-base mb-2 text-gray-600 dark:text-neutral-500 font-semibold "
        >
            <slot name="title" />
        </div>
        <div
            v-if="showDescSlot"
            class="text-gray-600 dark:text-neutral-500 text-sm"
        >
            <slot name="desc" />
        </div>
        <div
            v-if="showActionsSlot"
            class="mt-4 flex justify-between gap-5"
        >
            <slot name="actions" />
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const slots = defineSlots()

const showTitleSlot = computed(() => !!slots.title?.())
const showDescSlot = computed(() => !!slots.desc?.())
const showActionsSlot = computed(() => !!slots.actions?.())


</script>

<style lang="scss" scoped></style>