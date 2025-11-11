<template>
    
        <base-menu-link
            link-destination="TheDashboard"
            link-icon="potted_plant"
            link-title="Dashboard"
            v-close-popper="true"
            class="w-1/3 md:w-full"
            :extra-classes="{ 'reset-is-active': !!isChatActive && isMobile }"
            />
        <base-menu-link
            link-destination="Account"
            link-icon="face"
            link-title="Profile"
            v-close-popper="true"
            :is-profile="true"
            class="w-1/3 md:w-full"
            :extra-classes="{ 'reset-is-active': !!isChatActive && isMobile}"
            />
        <!-- <li class="flex md:hidden w-1/3 justify-center">
            <button
                class="cursor-pointer transition-colors duration-600 block py-1 flex gap-1 items-center flex-col text-sm"
                :class="!!isChatActive ? 'text-primary dark:text-primary-700' : 'text-gray-600 hover:text-primary-500'"
                @click="handleChat"
            >
                <span class="material-symbols-outlined text-2xl">
                    chat_bubble
                </span>
                AI Chat
            </button>
        </li> -->
        <!-- <li class="hidden md:block">
            <button
                class="text-gray-600 hover:text-red-500 cursor-pointer transition-colors duration-600 py-2 flex gap-2 items-center flex-col md:flex-row"
                v-close-popper="true"
                @click="handleLogout"
            >
                <span class="material-symbols-outlined text-3xl">
                    logout
                </span>
                Log out
            </button>
        </li> -->
</template>

<script setup>

import { useMobileStore } from '../stores/useMobileStore';
import BaseMenuLink from './Base/BaseMenuLink.vue';

defineProps({
    isChatActive: {
        type: Boolean,
        required: false
    }
})

const {
    isMobile
} = useMobileStore()

</script>

<style lang="scss" scoped></style>