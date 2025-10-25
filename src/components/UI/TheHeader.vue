<template>
    <header 
        class="min-h-[60px] px-6 sticky t-0 bg-white shadow-lg flex items-center dark:bg-gray-950 dark:border-b border-gray-800"
        :class="{
            'justify-center' : isCenterSlotEmpty && isEndSlotEmpty,
            'justify-between' : !isEndSlotEmpty && isCenterSlotEmpty
            }"
    >
        <h1 class="font-roboto text-2xl font-bold text-primary flex gap-3">
            <span class="noto-color-emoji-regular">
                🌱
            </span>
            <span class="flex">
                <span class="text-primary-500">{{ firstString }}</span> <span class="text-primary-700">{{ secondString }}</span>
            </span>
        </h1>
        <slot name="center"/>
        <slot name="end"/>
    </header>
</template>

<script setup>
import { computed, useSlots } from 'vue';


const props = defineProps({
    projectTitle: {
        type: String,
        required: true
    }
})

const matchString = /[A-Z]/;

const indexTitle = props.projectTitle.search(matchString);

const firstString = props.projectTitle.substring(0, indexTitle)
const secondString = props.projectTitle.substring(indexTitle)

const slots = useSlots()

const isCenterSlotEmpty = computed(() => !slots.center || slots.center().length === 0)
const isEndSlotEmpty = computed(() => !slots.end || slots.end().length === 0)



</script>

<style lang="scss" scoped></style>