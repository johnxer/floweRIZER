<template>
    <input
        :type="inputType"
        :id="inputId"
        :placeholder="inputPlaceholder"
        :value="modelValue"
        @input="handleInput"
        class="px-4 py-2 rounded-lg border-2 focus:outline-0 focus:border-primary transition-colors duration-600 text-gray-500 dark:text-white/75 read-only:cursor-not-allowed read-only:opacity-50 read-only:focus:border-gray-300 read-only:focus:dark:border-neutral-600"
        :class="[
            !inputError ? 'border-gray-300 dark:border-gray-600' : 'border-red-300 dark:border-red-900',
        ]"
    >
</template>

<script setup lang="ts">

type Props = {
    modelValue: string | number;
    inputType?: string;
    inputId: string;
    inputPlaceholder?: string;
    inputError?: string;
}

withDefaults(defineProps<Props>(), {
    modelValue: '',
    inputType: 'text',
    inputPlaceholder: '',
    inputError: ''
})

const emit = defineEmits<{
    (e: 'update:modelValue', value: Props['modelValue']): void
}>()

const handleInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    emit('update:modelValue', target.value)
}

</script>

<style lang="scss" scoped></style>