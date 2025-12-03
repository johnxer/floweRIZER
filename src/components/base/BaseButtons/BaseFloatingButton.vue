<template>
    <Button
        type="button"
        v-tooltip="{
            content: tooltipContent,
            placement: 'left',
        }"
        size="icon-xl"
        class="fixed right-6 shadow-xl z-4 hover:scale-110"
    >
        <slot />
    </Button>
</template>

<script setup>

import { Button } from '@/components/ui/button';

defineProps({
    tooltipContent: {
        type: String,
        required: false
    }
})
</script>

<style lang="scss" scoped></style>