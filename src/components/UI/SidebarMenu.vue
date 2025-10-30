<template>
    <div
        class="fixed w-[300px] bottom-0 top-[60px] bg-white px-8 pb-8 pt-12 transition-all duration-600 ease-in-out"
        :class="isOpen ? 'right-0 shadow-2xl' : '-right-[300px] shadow-none'"
    >
        <button
            type="button"
            class="absolute -left-[20px] top-2 size-[40px] rounded-full bg-white border-2 border-gray-300 flex items-center justify-center cursor-pointer text-3xl text-gray-300 transition-all duration-600 hover:border-gray-400 hover:text-gray-400"
            :class="isOpen ? 'opacity-100 -left-[20px]' : 'opacity-0 left-0'"
            @click="handleSidebarMenu"
        >
            <span class="material-symbols-outlined">
                keyboard_arrow_right
            </span>
        </button>
        <ul class="space-y-3">
            <li>
                <router-link
                    class="text-gray-600 hover:text-primary-500 cursor-pointer transition-colors duration-600 block py-2 flex gap-2 items-center"
                    :to="{ name: 'TheDashboard' }"
                >
                    <span class="material-symbols-outlined text-3xl">
                        potted_plant
                    </span>
                    Dashboard
                </router-link>
            </li>
            <li>
                <router-link
                    class="text-gray-600 hover:text-primary-500 cursor-pointer transition-colors duration-600 block py-2 flex gap-2 items-center"
                    :to="{ name: 'Account' }"
                >
                    <span class="material-symbols-outlined text-3xl">
                        face
                    </span>
                    Profile
                </router-link>
            </li>

            <li>
                <button
                    class="text-gray-600 hover:text-red-500 cursor-pointer transition-colors duration-600 py-2 flex gap-2 items-center"
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
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/useAuthStore';

defineProps({
    isOpen: {
        type: Boolean,
        required: false,
        default: false
    }
})

const {
    logOutUser,
} = useAuthStore();

const router = useRouter()

const handleLogout = async () => {
    const success = await logOutUser();

    if (success) {
        router.push({ name: 'NotAuthed' })
    }
}

const emit = defineEmits(['toggle-sidebar'])

const handleSidebarMenu = () => {
    emit('toggle-sidebar')
}

</script>

<style lang="scss" scoped></style>