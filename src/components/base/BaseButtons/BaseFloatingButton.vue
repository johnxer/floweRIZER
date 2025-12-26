<template>
    <Button
        type="button"
        v-tooltip="{
            content: tooltipContent,
            placement: 'left',
        }"
        :variant="props.variant"
        :size="props.size"
        class="fixed right-6 shadow-xl z-4 hover:scale-110"
    >
        <slot />
    </Button>
</template>

<script setup lang="ts">
import { buttonVariants } from '@/components/ui/button';
import type { VariantProps } from 'class-variance-authority';

import { Button } from '@/components/ui/button';

type Props = {
    tooltipContent?: string
    variant?: VariantProps<typeof buttonVariants>['variant']
    size?: VariantProps<typeof buttonVariants>['size']
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'icon-xl',
})

</script>

<style lang="scss" scoped></style>