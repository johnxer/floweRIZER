<template>
    <div class="size-[200px] rounded-full border border-primary-200/50 bg-white dark:bg-gray-900 dark:border-0 mx-auto overflow-hidden relative mb-6 flex items-center justify-center inset-shadow-sm inset-shadow-primary-300/25 dark:inset-shadow-none">

        <h1 class="text-2xl font-bold flex flex-col items-center absolute size-full inset-0 justify-center">
            <span class="noto-color-emoji-regular text-7xl mb-4">
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