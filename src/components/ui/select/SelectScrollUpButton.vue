<script setup>
import { cn } from "@/lib/utils";
import { reactiveOmit } from "@vueuse/core";
import { SelectScrollUpButton, useForwardProps } from "reka-ui";

const props = defineProps({
    asChild: { type: Boolean, required: false },
    as: { type: null, required: false },
    class: { type: null, required: false },
});

const delegatedProps = reactiveOmit(props, "class");

const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
    <SelectScrollUpButton
        data-slot="select-scroll-up-button"
        v-bind="forwardedProps"
        :class="cn('flex cursor-default items-center justify-center py-1', props.class)
            "
    >
        <slot>
            <span class="material-symbols-outlined text-lg">
                arrow_drop_up
            </span>
        </slot>
    </SelectScrollUpButton>
</template>
