<template>
    <input
        :type="inputType"
        :id="inputId"
        :placeholder="inputPlaceholder"
        :value="modelValue"
        @input="handleInput"
        class="px-4 py-2 rounded-xl border-2 focus:outline-0 focus:border-primary transition-colors duration-600 text-gray-500 dark:text-white/75 read-only:cursor-not-allowed read-only:opacity-50 read-only:focus:border-gray-300 read-only:focus:dark:border-gray-600"
        :class="[
            !inputError ? 'border-gray-300 dark:border-gray-600' : 'border-red-300 dark:border-red-900',

    ]"
    >
</template>

<script setup>
defineProps({
    modelValue: {
        type: [String, Number],
        default: ''
    },
    inputType: {
        type: String,
        required: false,
        default: 'text'
    },
    inputId: {
        type: String,
        required: true
    },
    inputPlaceholder: {
        type: String,
        required: false,
        default: ''
    },
    inputError: {
        type: Boolean,
        default: false
    },
    // extraClasses: {
    //     type: String,
    //     required: false,
    //     default: ''
    // }
})

const emit = defineEmits(['update:modelValue'])

const handleInput = (e) => {
    emit('update:modelValue', e.target.value)
}

</script>

<style lang="scss" scoped></style>