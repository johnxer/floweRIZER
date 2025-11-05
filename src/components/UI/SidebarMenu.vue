<template>
    <div
        class="fixed w-full left-0 md:left-auto md:w-[300px] bottom-0 md:top-[60px] bg-white px-4 py-1 md:px-8 md:pb-8 md:pt-12 transition-all duration-600 ease-in-out shadow-menu dark:bg-gray-900 z-10"
        :class="isOpen ? 'md:right-0 md:shadow-2xl' : 'md:-right-[300px] md:shadow-none'"
    >
        <button
            type="button"
            class="absolute -left-[20px] top-2 size-[40px] rounded-full bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700 items-center justify-center cursor-pointer text-3xl text-gray-300 dark:text-gray-700 transition-all duration-600 hover:border-gray-400 hover:text-gray-400 dark:hover:border-gray-500 dark:hover:text-gray-500 hidden md:flex"
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
</template>

<script setup>
import { useRouter } from 'vue-router';

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

const emit = defineEmits(['toggle-sidebar'])

const handleSidebarMenu = () => {
    emit('toggle-sidebar')
}

</script>

<style lang="scss" scoped></style>