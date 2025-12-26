<template>
    <div
        class="container mx-auto px-4 md:px-6 "
        :class="isAuthed ? 'pb-[120px] mt-8 md:pb-8' : ''"
    >
        <slot />
    </div>
</template>

<script setup lang="ts">

type Props = {
    isAuthed?: boolean
}

withDefaults(defineProps<Props>(), {
    isAuthed: true
})

</script>

<style lang="scss" scoped></style>