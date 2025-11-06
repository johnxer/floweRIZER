<template>
    <div class="md:fixed md:top-0 md:w-full md:flex md:justify-center ">
        <div class="md:container md:absolute md:top-0 ">
            <!-- <transition name="menu-slide"> -->
            <!-- v-if="isOpen"  Problem: on mobile, i need to have it always open -->
                <div
                    class="fixed md:absolute w-full left-0 md:left-auto md:right-0 md:w-[200px] md:top-[60px] bottom-0 md:bottom-auto bg-white px-4 py-1 md:p-6 transition-all duration-600 ease-in-out shadow-menu dark:bg-gray-900 z-5 md:rounded-xl md:flex md:justify-center"
                    :class="isOpen ? 'md:shadow-2xl md:translate-y-0 md:opacity-100' : 'md:shadow-none md:-translate-y-75  md:opacity-0' "
                >
                    <ul class="md:space-y-3 flex gap-10 md:block w-full">
                        <base-menu-link
                            link-destination="TheDashboard"
                            link-icon="potted_plant"
                            link-title="Dashboard"
                            class="w-1/3 md:w-full"
                            :extra-classes="{'reset-is-active' : !!isChatActive}"
                            @click="handleSidebarMenu"
                        />
                        <base-menu-link
                            link-destination="Account"
                            link-icon="face"
                            link-title="Profile"
                            :is-profile="true"
                            class="w-1/3 md:w-full"
                            :extra-classes="{'reset-is-active' : !!isChatActive}"
                            @click="handleSidebarMenu"
                        />
                        <li class="flex md:hidden w-1/3 justify-center">
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
                        </li>
                        <li class="hidden md:block">
                            <button
                                class="text-gray-600 hover:text-red-500 cursor-pointer transition-colors duration-600 py-2 flex gap-2 items-center flex-col md:flex-row"
                                @click="handleLogout"
                            >
                                <span class="material-symbols-outlined text-3xl">
                                    logout
                                </span>
                                Log out
                            </button>
                        </li>
                    </ul>
                </div>
                <!-- </transition> -->
            <div style="display: none"
                class="hide fixed w-full left-0 md:left-auto md:w-[200px] bottom-0 md:bottom-auto md:top-[70px] bg-white px-4 py-1 md:p-8 transition-all duration-600 ease-in-out shadow-menu dark:bg-gray-900 z-10 md:rounded-l-xl md:flex md:items-center"
                :class="isOpen ? 'md:right-0 md:shadow-2xl' : 'md:-right-[300px] md:shadow-none'"
            >
                <button
                    type="button"
                    class="absolute -left-[20px] size-[40px] rounded-full bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700 items-center justify-center cursor-pointer text-3xl text-gray-300 dark:text-gray-700 transition-all duration-600 hover:border-gray-400 hover:text-gray-400 dark:hover:border-gray-500 dark:hover:text-gray-500 hidden md:flex"
                    :class="isOpen ? 'opacity-100 -left-[20px]' : 'opacity-0 left-0'"
                    @click="handleSidebarMenu"
                >
                    <span class="material-symbols-outlined">
                        keyboard_arrow_right
                    </span>
                </button>
                <ul class="md:space-y-3 flex gap-10 md:block">
                    <base-menu-link
                        link-destination="TheDashboard"
                        link-icon="potted_plant"
                        link-title="Dashboard"
                        class="w-1/2"
                        @click="handleSidebarMenu"
                    />
                    <base-menu-link
                        link-destination="Account"
                        link-icon="face"
                        link-title="Profile"
                        class="w-1/2"
                        @click="handleSidebarMenu"
                    />

                    <li class="hidden md:block">
                        <button
                            class="text-gray-600 hover:text-red-500 cursor-pointer transition-colors duration-600 py-2 flex gap-2 items-center flex-col md:flex-row"
                            @click="handleLogout"
                        >
                            <span class="material-symbols-outlined text-3xl">
                                logout
                            </span>
                            Log out
                        </button>
                    </li>
                </ul>
                <!-- <router-link
                class="relative cursor-pointer text-gray-400 dark:text-gray-600 hover:dark:text-primary-600 transition-colors duration-600 flex gap-2 items-center hidden md:flex"
                :to="{ name: 'Account' }"
            >
                <img
                    :src="user?.photoURL"
                    class="size-[30px] rounded-lg object-cover"
                />
                <span class="text-sm">{{ user?.displayName || 'Not set yet' }}</span>
            </router-link> -->
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

import { ref } from 'vue';
import { useAuth } from '../../composables/useAuth';
import BaseMenuLink from '../Base/BaseMenuLink.vue';

defineProps({
    isOpen: {
        type: Boolean,
        required: false,
        default: false
    }
})

const {
    logOutUser,
} = useAuth();

const router = useRouter()

const handleLogout = async () => {
    const success = await logOutUser();

    if (success) {
        await router.push({ name: 'NotAuthed' })
    } else {
        console.error('Logout failed')

    }
}

const emit = defineEmits(['toggle-sidebar', 'toggle-chat'])

const handleSidebarMenu = () => {
    emit('toggle-sidebar')
}

const isChatActive = ref(false)

const handleChat = () => {
    emit('toggle-chat')

    isChatActive.value = !isChatActive.value
}

</script>

<style lang="scss" scoped></style>