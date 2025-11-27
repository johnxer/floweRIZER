<template>
    <header
        class="px-4 md:px-6 sticky top-0 z-2 transition-all"
        :class="{ 'bg-gray-100 dark:bg-gray-950 shadow-2xl': isScrolled }"
    >
        <div class="container mx-auto flex items-center justify-between header-min-h">
            <router-link :to="{ name: 'TheDashboard' }">
                <!-- <h1 class="text-xl md:text-2xl font-bold text-primary flex gap-3">
                    <span class="noto-color-emoji-regular">
                        🌱
                    </span>
                    <span class="flex">
                        <span class="text-primary-500">{{ firstString }}</span> <span class="text-primary-700">{{ secondString }}</span>
                    </span>
                </h1> -->
                <the-logo size="base" />
            </router-link>
            <slot name="center" />
            <div>
                <div class="flex md:gap-4 items-center">
                    <notifications-dropdown />


                    <theme-dropdown />
                    <Button
                        v-if="isShown"
                        @click="uiStore.openModal('room')"
                        variant="hover-outline"
                        class="flex items-center gap-1"
                    >
                        <span class="material-symbols-outlined text-lg">
                            add
                        </span>
                        New room
                    </Button>
                    <div class="md:hidden">
                        <button
                            class="text-gray-400 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-900 cursor-pointer transition-colors duration-600 flex p-2"
                            @click="handleLogout"
                        >
                            <span class="material-symbols-outlined text-2xl">
                                logout
                            </span>
                        </button>

                    </div>
                    <div class="hidden md:flex">
                        <menu-dropdown />
                    </div>
                </div>
            </div>
        </div>
    </header>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';

import { useRoute } from 'vue-router';

import { Button } from '@/components/ui/button';

import MenuDropdown from './MenuDropdown.vue';
import NotificationsDropdown from './NotificationsDropdown.vue';
import TheLogo from './TheLogo.vue';
import ThemeDropdown from './ThemeDropdown.vue';

import { useAuthActions } from '@/composables';

import { useMobileStore } from '@/stores/useMobileStore';
import { useUIStore } from '@/stores/useUIStore';


const { handleLogout } = useAuthActions()

const mobileStore = useMobileStore();

const uiStore = useUIStore()

const route = useRoute()

const isScrolled = ref(false)

const headerHeight = 60;

const handleScroll = () => {
    const scrolled = window.scrollY > headerHeight
    if (scrolled !== isScrolled.value) {
        isScrolled.value = scrolled
    }
}

document.documentElement.style.setProperty('--headerHeight', `${headerHeight}px`)

const isShown = computed(() => route.name === 'TheDashboard' && !mobileStore.isMobile)

onMounted(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
})


</script>

<style lang="scss" scoped></style>