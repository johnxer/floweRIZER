<template>
    <header 
        class="min-h-[60px] px-6 sticky t-0 bg-white shadow-lg flex items-center dark:bg-gray-950 dark:border-b border-gray-800"
        :class="{'justify-center' : isCenterSlotEmpty && isEndSlotEmpty}"
    >
        <h1 class="font-roboto text-2xl font-bold text-primary">
            <span class="noto-color-emoji-regular">
                🌱
            </span>
            {{ projectTitle }}
        </h1>
        <slot name="center"/>
        <slot name="end"/>
    </header>
</template>

<script setup>
import { computed, useSlots } from 'vue';


defineProps({
    projectTitle: {
        type: String,
        required: true
    }
})

const slots = useSlots()

const isCenterSlotEmpty = computed(() => !slots.center || slots.center().length === 0)
const isEndSlotEmpty = computed(() => !slots.end || slots.end().length === 0)



</script>

<style lang="scss" scoped></style>