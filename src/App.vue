<template>
    <the-header
        v-if="isAuthed"
        :project-title="projectName"
    >
    </the-header>
    <the-logo-circle
        v-else
        :project-title="projectName"
        class="mt-8"
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
        :is-chat-open="isChatOpen"
    />
    <sidebar-menu
        v-if="isAuthed"
        @toggle-chat="toggleChat"
    />
</template>

<script setup>

import { generateOklchShades } from './utils/hex2oklch.js';

import TheChat from './components/AIChat/TheChat.vue';
import SidebarMenu from './components/UI/SidebarMenu.vue';
import TheHeader from './components/UI/TheHeader.vue';
import TheLogoCircle from './components/UI/TheLogoCircle.vue';

import { computed, ref, watchEffect } from 'vue';
import { useAuthStore } from './stores/useAuthStore';

const authStore = useAuthStore();

const isAuthed = computed(() => !!authStore.user)

const projectName = import.meta.env.VITE_PROJECT_NAME



const baseColor = ref('#99c23b')
// const baseColor = ref('#ddd24b')
const shades = ref({})

watchEffect(() => {
    shades.value = generateOklchShades(baseColor.value)

    console.log(shades.value)

    for (const [key, val] of Object.entries(shades.value)) {
        document.documentElement.style.setProperty(`--primary-color-user-${key}`, val)
    }
})

const isChatOpen = ref(false)

const toggleChat = () => {
    isChatOpen.value = !isChatOpen.value
}

</script>

<style lang="scss" scoped></style>