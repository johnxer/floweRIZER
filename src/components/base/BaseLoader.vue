<template>
    <div
        class="flex items-center justify-center"
        :class="positionClasses"
    >
        <div class="">
            <svg
                class="animate-spin text-primary dark:text-primary-800 mx-auto"
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
                    stroke-width="2"
                ></circle>
                <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M3.8,19.3l1.5-1.3c-1.4-1.6-2.3-3.7-2.3-5.9C3,7,7,3,12,3V1C5.9,1,1,5.9,1,12s1,5.3,2.8,7.3Z"
                ></path>
            </svg>
            <div
                v-if="hasText"
                class="text-gray-500 dark:text-gray-600 text-lg"
            >
                <slot />
            </div>
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
        type: String,
        required: false,
        default: 'base'
    }
})

const positionMap = {
    'absolute': {
        position: 'absolute',
        classes: 'absolute inset-0 w-full h-full',
        spinnerClasses: ''
    },
    'static': {
        position: 'static',
        classes: '',
        spinnerClasses: 'mx-auto'
    }
}


const sizeMap = {
    xs: {
        class: 'size-7'
    },
    sm: {
        class: 'size-10'
    },
    base: {
        class: 'size-20'
    },
    lg: {
        class: 'size-30'
    },

}


const slots = useSlots()

const hasText = computed(() => {
    return (slots.default && slots.default().length)
})

const positionClasses = computed(() => positionMap[props.positionType].classes)
const loaderClasses = computed(() => positionMap[props.positionType].spinnerClasses)

const sizeClass = computed(() => sizeMap[props.loaderSize].class)

</script>

<style lang="scss" scoped></style>