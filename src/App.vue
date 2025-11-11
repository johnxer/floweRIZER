<template>
    <the-header
        v-if="isAuthed"
        :project-title="projectName"
        @toggle-sidebar="toggleSidebar"
        :is-open="isSidebarOpen"
    >
    </the-header>
    <!-- <div
        class="container mt-8 mx-auto px-4 md:px-6 "
        :class="isAuthed ? 'pb-[170px] md:pb-8' : 'pb-8'"
    > -->
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
        
    <!-- </div> -->
    <sidebar-menu
        v-if="isAuthed"
        @toggle-sidebar="toggleSidebar"
        @toggle-chat="toggleChat"
        :is-open="isSidebarOpen"
    />
</template>

<script setup>

import { generateOklchShades } from './utils/hex2oklch.js';

import TheChat from './components/AIChat/TheChat.vue';
import SidebarMenu from './components/UI/SidebarMenu.vue';
import TheHeader from './components/UI/TheHeader.vue';
import TheLogoCircle from './components/UI/TheLogoCircle.vue';

import { computed, onMounted, ref, watchEffect } from 'vue';
import { useAuthStore } from './stores/useAuthStore';
import { useMobileStore } from './stores/useMobileStore.js';

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

const isSidebarOpen = ref(false)

const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value
}

const isChatOpen = ref(false)

const toggleChat = () => {
    isChatOpen.value = !isChatOpen.value
}


const mobileStore = useMobileStore()

// Aktivujeme posluchač při startu aplikace
onMounted(() => {
  // Tím se spustí resize listener uvnitř store
  console.log('📱 Mobile store initialized')
})

</script>

<style lang="scss" scoped></style>