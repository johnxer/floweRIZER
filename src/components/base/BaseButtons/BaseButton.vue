<template>
    <button
        class="border border-2 cursor-pointer transition-all duration-600 disabled:cursor-not-allowed"
        :class="[
            buttonSizeClasses,
            buttonStyleClasses,
            buttonColorClasses,
            { 'w-full': btnFullWidth }
        ]"
    >
        <slot />
    </button>
</template>

<script setup>
import { computed } from 'vue'


const props = defineProps({
    btnSize: {
        type: String,
        required: false,
        default: 'lg'
    },
    btnStyle: {
        type: String,
        required: false,
        default: 'base'
    },
    btnColor: {
        type: String,
        required: false,
        default: 'base'
    },
    btnFullWidth: {
        type: Boolean,
        required: false,
        default: true
    }
})

const sizeMap = {
    lg: {
        classes: 'px-2 py-2 text-xl'
    },
    base: {
        classes: 'px-2 py-2 text-base'
    },
    sm: {
        classes: 'px-2 py-1 text-sm'
    },
    custom: {
        classes: ''
    }
}

const styleMap = {
    base: {
        classes: 'rounded-full'
    },
    notRounded: {
        classes: 'rounded-xl'
    },
    notRoundedMd: {
        classes: 'rounded-md'
    }
}

const colorMap = {
    base: {
        classes: 'bg-primary text-white dark:bg-primary-900 dark:text-primary-600 border-primary dark:border-primary-900 hover:bg-transparent hover:text-primary disabled:bg-primary/50 disabled:border-primary/0 disabled:hover:text-white'
    },
    baseAlt: {
        classes: 'text-primary dark:text-primary-200 border-primary-200 dark:border-primary-800 hover:text-primary-400 disabled:bg-primary/50 disabled:border-primary/0 disabled:hover:text-primary'
    },
    danger: {
        classes: 'bg-red-500 text-white dark:bg-red-900 dark:text-white/50 border-red-500 dark:border-red-900 hover:bg-transparent hover:text-red-500 disabled:bg-red-500/50 disabled:border-red-500/0 disabled:hover:text-white'
    },
    neutral: {
        classes: 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-transparent hover:text-gray-400 disabled:bg-gray-500/50 disabled:border-gray-500/0 disabled:hover:text-white'
    },
    neutralAlt: {
        classes: 'text-gray-500 dark:text-gray-200 border-gray-200 dark:border-gray-800 hover:text-gray-400 disabled:bg-gray-500/50 disabled:border-gray-500/0 disabled:hover:text-white'
    }
}


const buttonSizeClasses = computed(() => sizeMap[props.btnSize].classes)

const buttonStyleClasses = computed(() => styleMap[props.btnStyle].classes)

const buttonColorClasses = computed(() => colorMap[props.btnColor].classes)


</script>

<style lang="scss" scoped></style>