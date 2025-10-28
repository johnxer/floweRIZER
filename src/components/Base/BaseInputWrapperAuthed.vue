<template>
    <div class="flex flex-col">
        <label
            :for="fieldId"
            class="block text-gray-400 dark:text-white/35 text-sm"
            :class="{'flex justify-between' : fieldLabelExtra}"
        >
            {{ fieldLabel }}

            <small v-if="fieldLabelExtra">{{ fieldLabelExtra }}</small>
        </label>
        <slot />
    </div>
</template>

<script setup>

defineProps({
    fieldId: {
        type: String,
        required: true,
    },
    fieldLabel: {
        type: String,
        required: true,
    },
    fieldLabelExtra: {
        type: String,
        required: false,
    }
   
})

</script>

<style lang="scss" scoped></style>