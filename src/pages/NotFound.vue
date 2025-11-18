<template>
    <base-container>
        <div class="text-center md:max-w-[600px] max-w-full mx-auto flex items-center flex-col">
            <h1 class="text-2xl md:text-2xl text-gray-700 mb-6">
                <!-- <span class="h-[56px] relative text-white text-[2.5rem] font-light px-4 py-1 bg-primary block after:absolute after:top-0 after:border-t-[0] after:border-t-[56px] after:border-l-[2rem] after:border-transparent after:border-l-gray-100 after:left-0 before:absolute before:top-0 before:border-t-[0] before:border-b-[56px] before:border-r-[2rem] before:border-transparent before:border-r-gray-100 before:right-0 mb-2"> -->
                <span class="h-[56px] relative text-[2.5rem] font-light px-4 py-1 text-primary mb-0 block">
                    Oops!
                </span>
                Your page went root-bound!
            </h1>
            <img
                alt="404 Not Found"
                src="/src/img/404.svg"
                class="w-3/5 sm:w-2/5 mb-4"
            >
            <router-link
                class="inline-flex items-center text-xl text-primary-700 px-3 py-1 gap-1 group"
                :to="isAuthed ? { name: 'TheDashboard' } : { name: 'NotAuthed' }"
            >
                {{ isAuthed ? 'Go to dashboard' : 'Go to login page' }}
                <span class="material-symbols-outlined text-2xl group-hover:translate-x-2 transition-transform duration-600">
                    arrow_right_alt
                </span>
            </router-link>
        </div>
    </base-container>
</template>

<script setup>
import { computed } from 'vue';
import BaseContainer from '../components/Base/BaseContainer.vue';
import { useAuthStore } from '../stores/useAuthStore';

const authStore = useAuthStore();

const isAuthed = computed(() => !!authStore.user)

</script>

<style lang="scss" scoped></style>