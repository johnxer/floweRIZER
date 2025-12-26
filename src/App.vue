<template>
    <the-header v-if="isAuthed" />
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
</template>

<script setup>

import TheChat from './components/features/chat/TheChat.vue';
import TheHeader from './components/layout/TheHeader.vue';

import { computed, ref, watchEffect } from 'vue';

import { useRoute } from 'vue-router';

import { useAuthStore } from './stores/useAuthStore';

import { generateOklchShades } from './utils';

const authStore = useAuthStore();

const isAuthed = computed(() => !!authStore.user)

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

</script>

<style lang="scss" scoped></style>