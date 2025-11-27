<script setup>
import { cn } from "@/lib/utils";

const props = defineProps({
    class: { type: null, required: false },
});
</script>

<template>
    <div
        data-slot="card"
        :class="cn(
            'group/card bg-card text-card-foreground flex flex-col gap-6 rounded-xl py-4 md:py-6 shadow-box',
            props.class,
        )
            "
    >
        <slot />
    </div>
</template>
