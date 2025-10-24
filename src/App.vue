<template>
    <the-header 
        v-if="isAuthed"
        :project-title="projectName" 
    />

    <div class="container mt-6">
        <div class="h-[200px] w-[200px] rounded-full border border-gray-400 bg-white dark:bg-gray-900 dark:border-0 mx-auto overflow-hidden relative mb-6 flex items-center justify-center inset-shadow-sm inset-shadow-gray-600 dark:inset-shadow-none">

            <h1 class="font-roboto text-2xl font-bold text-primary flex flex-col items-center absolute h-full w-full inset-0 justify-center">
                <span class="noto-color-emoji-regular text-7xl mb-4">
                    🌱
                </span>
                {{ projectName }}
            </h1>

        </div>
        <router-view />
    </div>
</template>

<script setup>
import TheHeader from './components/UI/TheHeader.vue';

const projectName = import.meta.env.VITE_PROJECT_NAME

const isAuthed = false;

</script>

<style lang="scss" scoped></style>