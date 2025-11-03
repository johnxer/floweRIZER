<template>
    <div
        class="container mx-auto px-4 md:px-6 "
        :class="isAuthed ? 'pb-[170px] mt-8 md:pb-8' : 'pb-8'"
    >
        <slot />
    </div>
</template>

<script setup>


defineProps({
    isAuthed: {
        type: Boolean,
        required: false,
        default: true,
    }
})


</script>

<style lang="scss" scoped>

</style>