<template>
    <the-header
        v-if="isAuthed"
        :project-title="projectName"
    />
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
        v-if="isAuthed && mobileStore.isMobile"
        @toggle-chat="toggleChat"
    />
    
    <transition name="fade">
        <button
            v-if="isBtnShown"
            class="fixed bottom-[calc(var(--bottomBarHeight)_+_var(--spacing)_*_2)] right-6 size-14 bg-primary-500 hover:bg-primary-600 transition-all duration-600 flex flex-col items-center justify-center rounded-lg shadow-xl text-sm cursor-pointer text-white dark:text-primary-800 z-4 hover:scale-110"
            @click="roomStore.openAddModal"
        >
            <span class="material-symbols-outlined text-2xl">
                add
            </span>
            Room
        </button>
    </transition>
</template>

<script setup>

import { generateOklchShades } from './utils/hex2oklch.js';

import TheChat from './components/AIChat/TheChat.vue';
import SidebarMenu from './components/UI/SidebarMenu.vue';
import TheHeader from './components/UI/TheHeader.vue';
import TheLogoCircle from './components/UI/TheLogoCircle.vue';

import { computed, ref, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from './stores/useAuthStore';
import { useMobileStore } from './stores/useMobileStore.js';
import { useRoomsStore } from './stores/useRoomsStore.js';

const authStore = useAuthStore();

const mobileStore = useMobileStore()

const roomStore = useRoomsStore()

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

const isBtnShown = computed(() => route.name === 'TheDashboard' && mobileStore.isMobile && isAuthed.value && !isChatOpen.value)

</script>

<style lang="scss" scoped></style>