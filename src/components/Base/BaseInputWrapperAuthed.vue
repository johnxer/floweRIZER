<template>
    <div class="flex flex-col">
        <div>
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
        <transition
            name="fade"
            mode="out-in"
        >
            <div
                v-if="errorText"
                class="text-red-500 dark:text-red-900 text-end text-xs"
            >
                {{ errorText }}
            </div>
        </transition>
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
        required: false,
        default: null
    },
    fieldLabelExtra: {
        type: String,
        required: false,
    },
    errorText: {
        type: String,
        required: false,
    }
   
})

</script>

<style lang="scss" scoped></style>