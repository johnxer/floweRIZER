<template>
    <div class="h-[120px] mx-auto overflow-hidden relative flex items-center justify-center mb-4">
        <h1 class="text-xl font-bold flex flex-col items-center justify-center">
            <span class="noto-color-emoji-regular text-5xl mb-2">
                🌱
            </span>
            <span class="flex">
                <span class="text-primary-500">{{ firstString }}</span> <span class="text-primary-700">{{ secondString }}</span>
            </span>
        </h1>

    </div>
</template>

<script setup>


const props = defineProps({
    projectTitle: {
        type: String,
        required: true
    }
})

const matchString = /[A-Z]/;

const indexTitle = props.projectTitle.search(matchString);

const firstString = props.projectTitle.substring(0, indexTitle)
const secondString = props.projectTitle.substring(indexTitle)

</script>

<style lang="scss" scoped></style>