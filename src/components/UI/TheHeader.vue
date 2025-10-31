<template>
    <header class="min-h-[60px] px-4 md:px-6 sticky top-0 z-1 bg-white shadow-lg flex items-center dark:bg-gray-900 dark:border-b border-gray-800 justify-between">
        <router-link :to="{ name: 'TheDashboard' }">
            <h1 class="font-roboto text-2xl font-bold text-primary flex gap-3">
                <span class="noto-color-emoji-regular">
                    🌱
                </span>
                <span class="flex">
                    <span class="text-primary-500">{{ firstString }}</span> <span class="text-primary-700">{{ secondString }}</span>
                </span>
            </h1>
        </router-link>
        <slot name="center" />

        <!-- <slot name="end"/> -->
        <div>
            <div class="flex gap-5 items-center">
                <v-dropdown trap-focus>
                    <button
                        class="relative transition-colors duration-600 flex"
                        :class="hasNotifications ? 'cursor-pointer text-gray-400 dark:text-gray-600 hover:dark:text-primary-600' : 'cursor-default text-gray-200 dark:text-gray-800'"
                        :disabled="!hasNotifications"
                    >
                        <span class="material-symbols-outlined text-2xl relative">
                            notifications
                            <span
                                v-if="hasNotifications"
                                class="absolute top-0 right-0 flex size-2"
                            >
                                <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-400 opacity-75" />
                                <span class="relative inline-flex size-2 rounded-full bg-primary-500" />
                            </span>
                        </span>
                    </button>
                    <template #popper>
                        <div class="text-base max-w-[300px] font-normal p-4">
                            <transition-group
                                name="fade"
                                tag="ul"
                                class="text-sm"
                            >
                                <li
                                    v-for="notification in notifications"
                                    :key="notification.id"
                                    class="border-b last:border-0 border-gray-200 pb-2 mb-2 last:pb-0 last:mb-0"
                                >
                                    <div v-html="notification.action" />
                                    <div class="text-end">
                                        <button
                                            type="button"
                                            class="mt-2 text-primary inline-flex align-top cursor-pointer hover:underline"
                                            @click="handleDismissNotification(notification.id)"
                                        >
                                            Dismiss
                                        </button>
                                    </div>
                                </li>
                            </transition-group>
                        </div>
                    </template>
                </v-dropdown>
                <div class="md:hidden">
                    <button
                        class="text-gray-400 hover:text-red-500 cursor-pointer transition-colors duration-600 flex"
                        @click="handlelogout"
                    >
                        <span class="material-symbols-outlined text-2xl">
                            logout
                        </span>
                    </button>

                </div>

                <div class="hidden md:flex">
                    <button
                        class="relative cursor-pointer text-gray-400 dark:text-gray-600 hover:dark:text-primary-600 transition-colors duration-600 flex gap-2 items-center border p-2 rounded-xl border-gray-200"
                        @click="handleSidebarMenu"
                    >
                        <img
                            :src="user?.photoURL"
                            class="size-[30px] rounded-lg object-cover"
                        />
                        <span class="text-sm">{{ user?.displayName || 'Not set yet' }}</span>
                        <span class="material-symbols-outlined text-2xl">
                            menu
                        </span>
                    </button>
                </div>
            </div>
        </div>
    </header>
</template>

<script setup>
import { computed, ref, useSlots } from 'vue';

import { storeToRefs } from 'pinia';
// import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/useAuthStore';

// const router = useRouter()

const props = defineProps({
    projectTitle: {
        type: String,
        required: true
    }
})

const {
    user,
    error,
    isPending,
} = storeToRefs(useAuthStore());

// const {
//     logOutUser,
// } = useAuthStore();


const matchString = /[A-Z]/;

const indexTitle = props.projectTitle.search(matchString);

const firstString = props.projectTitle.substring(0, indexTitle)
const secondString = props.projectTitle.substring(indexTitle)

const slots = useSlots()

const isCenterSlotEmpty = computed(() => !slots.center || slots.center().length === 0)
// const isEndSlotEmpty = computed(() => !slots.end || slots.end().length === 0)

console.log(user.value)

// const handleLogout = async () => {
//     const success = await logOutUser();

//     if (success) {
//         router.push({ name: 'NotAuthed' })
//     }
// }


const hasNotifications = computed(() => notifications.value.length)


const typeNotificationsMap = [
    {
        id: 1,
        action: 'Water plant ##plantName## within 24 hours'
    },
    {
        id: 2,
        action: 'Fertilize ##plantName## this week'
    }
]

const notificationsArrayFromFB = ref([
    {
        id: 1,
        type: 1, // water within 24 hours
        object: 'Orchid',
    },
    {
        id: 2,
        type: 1, // water within 24 hours
        object: 'Cactus',
    }
])

const notifications = computed(() => {
    return notificationsArrayFromFB.value.map(n => {
        const typeD = typeNotificationsMap.find(m => m.id === n.type)

        return {
            ...n,
            action: typeD ? typeD.action.replace('##plantName##', `<strong>${n.object}</strong>`) : 'Unknown action'
        }
    })
})

const handleDismissNotification = (notificationId) => {
    notificationsArrayFromFB.value = notificationsArrayFromFB.value.filter(i => i.id !== notificationId)
}

const emit = defineEmits(['toggle-sidebar'])

const handleSidebarMenu = () => {
    emit('toggle-sidebar')
}


</script>

<style lang="scss" scoped></style>