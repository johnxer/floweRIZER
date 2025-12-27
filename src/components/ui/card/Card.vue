<script setup lang="ts">
import { cn } from "@/lib/utils";

const props = defineProps({
    class: { type: null, required: false },
});
</script>

<template>
    <div
        data-slot="card"
        :class="cn(
            'group/card bg-card text-card-foreground flex flex-col gap-6 md:gap-6 rounded-xl shadow-box py-4 md:py-6',
            props.class,
        )
            "
    >
        <slot />
    </div>
</template>
