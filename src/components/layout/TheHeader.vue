<template>
    <header
        class="px-4 md:px-6 sticky top-0 z-2 transition-all duration-600"
        :class="isScrolled ? 'bg-gray-100 dark:bg-neutral-950 shadow-2xl' : 'bg-transparent dark:bg-transparent shadow-none'"
    >
        <div class="container mx-auto flex items-center justify-between header-min-h">
            <router-link :to="{ name: 'TheDashboard' }">
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

                    <menu-dropdown />

                </div>
            </div>
        </div>
    </header>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';

import { useRoute } from 'vue-router';

import { Button } from '@/components/ui/button';

import MenuDropdown from './MenuDropdown.vue';
import NotificationsDropdown from './NotificationsDropdown.vue';
import TheLogo from './TheLogo.vue';
import ThemeDropdown from './ThemeDropdown.vue';

import { useMobileStore } from '@/stores/useMobileStore';
import { useUIStore } from '@/stores/useUIStore';

const mobileStore = useMobileStore();

const uiStore = useUIStore()

const route = useRoute()

const isScrolled = ref(false)

const handleScroll = () => {
    const scrolled = window.scrollY > uiStore.headerHeight
    if (scrolled !== isScrolled.value) {
        isScrolled.value = scrolled
    }
}

document.documentElement.style.setProperty('--headerHeight', `${uiStore.headerHeight}px`)

const isShown = computed(() => route.name === 'TheDashboard' && !mobileStore.isMobile)

onMounted(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
})

</script>

<style lang="scss" scoped></style>