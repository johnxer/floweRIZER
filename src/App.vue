<template>
    <the-header
        v-if="isAuthed"
        :project-title="projectName"
    >
        <template #end>
            <span class="material-symbols-outlined text-3xl">
                menu
            </span>
        </template>
    </the-header>
    <div class="container mt-8 mx-auto px-6">
        <the-logo-circle
            v-if="!isAuthed"
            :project-title="projectName"
        />
        <router-view />
    </div>
</template>

<script setup>
import { ref } from 'vue';
import TheHeader from './components/UI/TheHeader.vue';

const projectName = import.meta.env.VITE_PROJECT_NAME


const isAuthed = ref(true)

</script>

<style lang="scss" scoped></style>