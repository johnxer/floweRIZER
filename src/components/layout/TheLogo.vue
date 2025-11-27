<template>
    <h1 class="text-2xl font-bold flex items-center justify-center gap-2">
        <img
            src="https://firebasestorage.googleapis.com/v0/b/flower-organizer.firebasestorage.app/o/src%2Flogo_shape.svg?alt=media&token=1d8cdd31-196e-4bd4-a8d1-cdff24b60fd7"
            :class="size.logo"
            :alt="projectName"
        />
        <span :class="size.text">
            <span class="text-primary-500">{{ firstString }}</span><span class="text-primary-700">{{ secondString }}</span>
        </span>
    </h1>
</template>

<script setup>
import { computed } from 'vue';


const props = defineProps({
    size: {
        type: String,
        default: 'lg'
    }
})

const sizeMap = {
    lg: {
        logo: 'size-14',
        text: 'text-2xl'
    },
    base: {
        logo: 'size-10',
        text: 'text-xl'
    },
}

const size = computed(() => sizeMap[props.size])


const projectName = import.meta.env.VITE_PROJECT_NAME

const matchString = /[A-Z]/;

const indexTitle = projectName.search(matchString);

const firstString = projectName.substring(0, indexTitle)
const secondString = projectName.substring(indexTitle)

</script>

<style lang="scss" scoped></style>