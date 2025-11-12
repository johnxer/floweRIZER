<template>
    <div>
        <div class="text-primary-700 flex items-center gap-2 mb-2">
            <span class="material-symbols-outlined text-3xl">
                {{ props.icon }}
            </span>
            <span class="text-xl">
                {{ props.value }}
            </span>
        </div>
        <div class="text-gray-400 text-xs md:text-sm">
            {{ props.label }}
        </div>
    </div>
</template>

<script setup>

const props = defineProps({
    icon: {
        type: String,
        required: true,
    },
    value: {
        type: Number,
        required: true,
    },
    label: {
        type: String,
        required: true,
    }
})

</script>

<style lang="scss" scoped></style>