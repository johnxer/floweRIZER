<template>
    <div class="checkbox-wrapper">
        <input
            type="checkbox"
            :id="id"
            :checked="modelValue"
            @change="handleChange"
        />
        <label :for="id">
            <span class="material-symbols-outlined">
                check
            </span>
        </label>
    </div>
</template>

<script setup lang="ts">
    type Props = {
        id: string;
        modelValue: boolean;
    }

defineProps<Props>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: Props['modelValue']): void
}>()

const handleChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    emit('update:modelValue', target.checked);
};
</script>

<style lang="scss" scoped></style>