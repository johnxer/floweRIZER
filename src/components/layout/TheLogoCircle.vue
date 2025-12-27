<template>
    <h1 class="text-2xl font-bold flex items-center justify-center gap-2">
        <img
            src="https://firebasestorage.googleapis.com/v0/b/flower-organizer.firebasestorage.app/o/src%2Flogo_shape.svg?alt=media&token=1d8cdd31-196e-4bd4-a8d1-cdff24b60fd7"
            class="size-14"
            :alt="projectTitle"
        />
        <span class="flex">
            <span class="text-primary-500">{{ firstString }}</span> <span class="text-primary-700">{{ secondString }}</span>
        </span>
    </h1>
</template>

<script setup lang="ts">

type Props = {
    projectTitle: string
}

const props = defineProps<Props>()

const matchString = /[A-Z]/;

const indexTitle = props.projectTitle.search(matchString);

const firstString = props.projectTitle.substring(0, indexTitle)
const secondString = props.projectTitle.substring(indexTitle)

</script>

<style lang="scss" scoped></style>