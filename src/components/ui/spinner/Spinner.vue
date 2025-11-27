<script setup>
import { cn } from "@/lib/utils";
import { LoaderIcon } from "lucide-vue-next";

const props = defineProps({
    class: { type: null, required: false },
});
</script>

<template>
    <LoaderIcon
        role="status"
        aria-label="Loading"
        :class="cn('size-4 animate-spin', props.class)"
    />

</template>
