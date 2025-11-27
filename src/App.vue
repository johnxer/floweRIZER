<template>
    <the-header
        v-if="isAuthed"
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
        :is-chat-open="isChatOpen"
    />
    <sidebar-menu
        v-if="isAuthed && mobileStore.isMobile"
        @toggle-chat="toggleChat"
    />
</template>

<script setup>



import TheChat from './components/features/chat/TheChat.vue';
import SidebarMenu from './components/layout/SidebarMenu.vue';
import TheHeader from './components/layout/TheHeader.vue';

import { computed, ref, watchEffect } from 'vue';

import { useRoute } from 'vue-router';

import { useAuthStore } from './stores/useAuthStore';
import { useMobileStore } from './stores/useMobileStore.js';

import { generateOklchShades } from './utils';

const authStore = useAuthStore();

const mobileStore = useMobileStore()

const isAuthed = computed(() => !!authStore.user)

const projectName = import.meta.env.VITE_PROJECT_NAME

const route = useRoute();

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

const isNotFound = computed(() => route.name === 'NotFound')

</script>

<style lang="scss" scoped></style>