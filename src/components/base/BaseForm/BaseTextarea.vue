<template>
    <textarea
        :id="textareaId"
        :placeholder="textareaPlaceholder"
        :value="modelValue"
        @input="handleInput"
        class="px-4 py-2 rounded-lg border-2 w-full read-only:cursor-not-allowed focus:outline-0 read-only:opacity-50 text-gray-500 dark:text-white/75 h-[100px] flex"
        :class="!textareaError ? 'border-gray-300 dark:border-gray-600' : 'border-red-300 dark:border-red-900'"
    />
</template>

<script setup lang="ts">
type Props = {
    modelValue: string | number;
    textareaId: string;
    textareaPlaceholder?: string;
    textareaError?: boolean;
}

withDefaults(defineProps<Props>(), {
    modelValue: '',
    textareaPlaceholder: '',
    textareaError: false
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