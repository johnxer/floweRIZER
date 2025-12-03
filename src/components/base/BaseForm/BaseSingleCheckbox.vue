<template>
    <div class="checkbox-wrapper">
        <input
            type="checkbox"
            :id="props.id"
            :checked="props.modelValue"
            @change="emit('update:modelValue', $event.target.checked)"
        />
        <label :for="props.id">
            <span class="material-symbols-outlined">
                check
            </span>
        </label>
    </div>
</template>

<script setup>
const props = defineProps({
    id: {
        type: String,
        required: true,
    },
    modelValue: {
        type: Boolean,
        required: true,
    },
})

const emit = defineEmits(['update:modelValue'])
</script>

<style lang="scss" scoped></style>