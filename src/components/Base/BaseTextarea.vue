<template>
    <textarea
        :id="textareaId"
        :placeholder="textareaPlaceholder"
        :value="modelValue"
        @input="handleInput"
        class="px-4 py-2 rounded-xl border-2 w-full read-only:cursor-not-allowed focus:outline-0 read-only:opacity-50 text-gray-500 dark:text-white/75 h-[100px]"
        :class="!textareaError ? 'border-gray-300 dark:border-gray-500' : 'border-red-300 dark:border-red-900'"
    />
</template>

<script setup>
defineProps({
    modelValue: {
        type: [String, Number],
        default: ''
    },
    textareaId: {
        type: String,
        required: true
    },
    textareaPlaceholder: {
        type: String,
        required: false,
        default: ''
    },
    textareaError: {
        type: Boolean,
        required: false,
        default: false
    }
})

const emit = defineEmits(['update:modelValue'])

const handleInput = (e) => {
    emit('update:modelValue', e.target.value)
}

</script>

<style lang="scss" scoped></style>