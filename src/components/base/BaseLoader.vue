<template>
    <div
        class="flex items-center justify-center"
        :class="[
            positionClasses,
            bgColorClass,
            {
                'flex-col': hasText,
                'z-1': hasBg,
                'backdrop-blur-[5px]': hasBg && bgBlur,
            }
        ]"
    >
        <Spinner :class="[
            sizeClass,
            loaderClasses,
            colorClass,
            { 'mb-3': hasText }
        ]" />
        <div
            v-if="hasText"
            class="text-gray-500 dark:text-neutral-600 text-base"
        >
            <slot />
        </div>
    </div>
</template>

<script setup>
import { computed, useSlots } from 'vue';

import Spinner from '@/components/ui/spinner/Spinner.vue';


const props = defineProps({
    position: {
        type: String,
        required: false,
        default: 'static'
    },
    size: {
        type: String,
        required: false,
        default: 'base'
    },
    color: {
        type: String,
        required: false,
        default: 'base'
    },
    hasBg: {
        type: Boolean,
        required: false,
        default: true
    },
    bgBlur: {
        type: Boolean,
        required: false,
        default: false
    },
    bgColor: {
        type: String,
        required: false,
        default: 'base'
    }
})

const positionMap = {
    absolute: {
        classes: 'absolute inset-0 w-full h-full',
        spinnerClasses: ''
    },
    fixed: {
        classes: 'fixed inset-0 w-full h-full',
        spinnerClasses: ''
    },
    static: {
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
    md: {
        class: 'size-15'
    },
    base: {
        class: 'size-20'
    },
    lg: {
        class: 'size-30'
    },
}

const colorMap = {
    base: {
        class: 'text-gray-200 dark:text-neutral-600'
    },
}

const bgColor = {
    base: {
        class: 'bg-white/60 dark:bg-neutral-900/80'
    },
    body: {
        class: 'bg-gray-100/80 dark:bg-neutral-900/80'
    }
}

const slots = useSlots()

const hasText = computed(() => {
    return (slots.default && slots.default().length)
})

const positionClasses = computed(() => positionMap[props.position].classes)
const loaderClasses = computed(() => positionMap[props.position].spinnerClasses)

const sizeClass = computed(() => sizeMap[props.size].class)

const colorClass = computed(() => colorMap[props.color].class)

const bgColorClass = computed(() => bgColor[props.bgColor].class)

</script>

<style lang="scss" scoped></style>
