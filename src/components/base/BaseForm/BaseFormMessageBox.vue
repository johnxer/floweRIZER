<template>
    <div
        class="border-2 rounded-xl px-3 py-2 mb-4 text-sm flex gap-2 items-start"
        :class="messageColorClasses"
    >
        <span class="material-symbols-outlined transition text-xl relative top-[-1px]">
            {{ messageIconClass }}
        </span>
        <slot />
    </div>
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps({
    messageType: {
        type: String,
        required: true
    }
})

const messageTypeMap = [
    {
        type: 'error',
        iconClass: 'error',
        colorClasses: 'border-red-500 dark:border-red-900 text-red-500 dark:text-red-900'

    },
    {
        type: 'success',
        iconClass: 'check',
        colorClasses: 'border-primary-500 dark:border-primary-900 text-primary-500 dark:text-primary-900'
    }
]

const messageIconClass = computed(() => messageTypeMap.find(m => m.type === props.messageType).iconClass)

const messageColorClasses = computed(() => messageTypeMap.find(m => m.type === props.messageType).colorClasses)

</script>

<style lang="scss" scoped></style>