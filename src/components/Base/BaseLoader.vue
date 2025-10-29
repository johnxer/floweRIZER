<template>
    <div
        class="flex items-center justify-center"
        :class="positionClasses"
    >
        <div>
            <svg
                class="size-20 animate-spin text-primary"
                :class="[
                    sizeClass,
                    loaderClasses,
                    { 'mb-3': hasText }
                ]"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
            >
                <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                ></circle>
                <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
            </svg>
            <slot />
        </div>
    </div>
</template>

<script setup>
import { computed, useSlots } from 'vue';


const props = defineProps({
    positionType: {
        type: String,
        required: false,
        default: 'static'
    },
    loaderSize: {
        type: Number,
        required: false,
        default: 20
    }
})

const positionMap = [
    {
        position: 'absolute',
        classes: 'absolute inset-0 w-full h-full',
        spinnerClasses: ''
    },
    {
        position: 'static',
        classes: '',
        spinnerClasses: 'mx-auto'
    }
]


const slots = useSlots()

const hasText = computed(() => {
    return (slots.default && slots.default().length)
})

const positionClasses = computed(() => positionMap.find(m => m.position === props.positionType).classes)
const loaderClasses = computed(() => positionMap.find(m => m.position === props.positionType).spinnerClasses)

const sizeClass = computed(() => `size-${props.loaderSize}`)

</script>

<style lang="scss" scoped></style>