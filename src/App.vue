<template>
    <the-header
        v-if="isAuthed"
        :project-title="projectName"
    >
    </the-header>
    <div class="container mt-8 mx-auto px-6">
        <the-logo-circle
            v-if="!isAuthed"
            :project-title="projectName"
        />

        <router-view v-slot="{ Component }">
            <transition
                name="fade"
                mode="out-in"
            >
                <component :is="Component" />
            </transition>

        </router-view>
        <the-chat 
            v-if="isAuthed"
        />
    </div>
</template>

<script setup>

import TheChat from './components/AIChat/TheChat.vue';
import TheHeader from './components/UI/TheHeader.vue';
import TheLogoCircle from './components/UI/TheLogoCircle.vue';

import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useAuthStore } from './stores/useAuthStore';

const {
    user,
} = storeToRefs(useAuthStore());



const projectName = import.meta.env.VITE_PROJECT_NAME

const isAuthed = computed(() => user.value)

</script>

<style lang="scss" scoped></style>