<script setup>
import { cn } from "@/lib/utils";
import { reactiveOmit } from "@vueuse/core";
import { SelectScrollDownButton, useForwardProps } from "reka-ui";

const props = defineProps({
    asChild: { type: Boolean, required: false },
    as: { type: null, required: false },
    class: { type: null, required: false },
});

const delegatedProps = reactiveOmit(props, "class");

const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
    <SelectScrollDownButton
        data-slot="select-scroll-down-button"
        v-bind="forwardedProps"
        :class="cn('flex cursor-default items-center justify-center py-1', props.class)
            "
    >
        <slot>
            <span class="material-symbols-outlined text-lg">
                arrow_drop_down
            </span>
        </slot>
    </SelectScrollDownButton>
</template>
