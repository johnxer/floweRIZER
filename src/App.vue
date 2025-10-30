<template>
    <the-header
        v-if="isAuthed"
        :project-title="projectName"
        @toggle-sidebar="toggleSidebar"
    >
    </the-header>
    <div 
        class="container mt-8 mx-auto px-4 md:px-6 "
        :class="isAuthed ? 'pb-[170px] md:pb-8' : 'pb-8'"
    >
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
        <the-chat v-if="isAuthed" />
    </div>
    <!-- :class="isSidebarOpen ? 'right-0 shadow-2xl' : '-right-[300px] shadow-none'" -->
    <sidebar-menu 
        v-if="isAuthed" 
        @toggle-sidebar="toggleSidebar"
        :isOpen="isSidebarOpen"

    />
</template>

<script setup>

import { generateOklchShades } from './utils/hex2oklch.js';

import TheChat from './components/AIChat/TheChat.vue';
import SidebarMenu from './components/UI/SidebarMenu.vue';
import TheHeader from './components/UI/TheHeader.vue';
import TheLogoCircle from './components/UI/TheLogoCircle.vue';

import { storeToRefs } from 'pinia';
import { computed, ref, watchEffect } from 'vue';
import { useAuthStore } from './stores/useAuthStore';

const {
    user,
} = storeToRefs(useAuthStore());


const projectName = import.meta.env.VITE_PROJECT_NAME

const isAuthed = computed(() => user.value)


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

</script>

<style lang="scss" scoped></style>