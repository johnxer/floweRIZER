<template>

    <header
        class="px-4 md:px-6 sticky top-0 z-2 transition-all"
        :class="{ 'bg-gray-100 shadow-2xl': isScrolled }"
    >
        <div 
            class="container mx-auto flex items-center justify-between"
            :class="`min-h-[${headerHeight}px]`"
        >
            <router-link :to="{ name: 'TheDashboard' }">
                <h1 class="font-roboto text-xl md:text-2xl font-bold text-primary flex gap-3">
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
                                        <div class="flex gap-2 items-start">
                                            <span class="material-symbols-outlined text-xl text-gray-300 relative -top-[1px]">
                                                info
                                            </span>

                                            <!-- {{ notifications }} -->
                                            <div
                                                v-html="notification.action"
                                                class="text-gray-500"
                                            />
                                        </div>
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
                    <base-button
                        @click="toggleModal"
                        btn-style="notRoundedMd"
                        btn-size="sm"
                        :btn-full-width="false"
                    >
                        New room
                    </base-button>
                    <div class="md:hidden">
                        <button
                            class="text-gray-400 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-900 cursor-pointer transition-colors duration-600 flex"
                            @click="handlelogout"
                        >
                            <span class="material-symbols-outlined text-2xl">
                                logout
                            </span>
                        </button>

                    </div>
                    <div class="hidden md:flex">
                        <button
                            class="cursor-pointer text-gray-400 dark:text-gray-600 hover:dark:text-primary-600 transition-colors duration-600 flex gap-2 items-center p-2"
                            @click="handleSidebarMenu"
                        >
                            <span class="material-symbols-outlined text-2xl">
                                menu
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <base-modal
            :modal-toggle="isModalOpen"
            @close-modal="toggleModal"
        >
            <add-new-room-content @close-modal="toggleModal" />
        </base-modal>
    </header>
</template>

<script setup>
import { v4 as uuidv4 } from 'uuid';
import { computed, onMounted, onUnmounted, ref, useSlots } from 'vue';
import { useGetDataByUserId } from '../../composables/useGetData';

import { differenceInDays } from 'date-fns';

import AddNewRoomContent from '../AddNewRoomContent.vue';
import BaseButton from '../Base/BaseButton.vue';
import BaseModal from '../Base/BaseModal/BaseModal.vue';

const props = defineProps({
    projectTitle: {
        type: String,
        required: true
    }
})

const matchString = /[A-Z]/;

const indexTitle = props.projectTitle.search(matchString);

const firstString = props.projectTitle.substring(0, indexTitle)
const secondString = props.projectTitle.substring(indexTitle)

const slots = useSlots()

const isCenterSlotEmpty = computed(() => !slots.center || slots.center().length === 0)

const hasNotifications = computed(() => notifications.value.length)

const {
    error,
    isPending,
    items: plants
} = useGetDataByUserId('plants')

const notificationsArrayFromFB = computed(() => {

    if (!plants.value?.length) return []

    return plants.value
        .filter(p => {
            if (!p.lastWateredDate) return true

            const lastWatered = p.lastWateredDate.toDate
                ? p.lastWateredDate.toDate()
                : new Date(p.lastWateredDate)

            const daysAgo = differenceInDays(new Date(), lastWatered)
            return daysAgo > p.wateringFrequency
        }).map(p => ({
            ...p,
            type: 1,
        }))
})


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

const notifications = computed(() => {
    return notificationsArrayFromFB.value.map(n => {
        const typeD = typeNotificationsMap.find(m => m.id === n.type)

        return {
            id: uuidv4(),
            ...n,
            action: typeD ? typeD.action.replace('##plantName##', `<strong>${n.name}</strong>`) : 'Unknown action'
        }


    })
})

const handleDismissNotification = (notificationId) => {

}

const emit = defineEmits(['toggle-sidebar'])

const handleSidebarMenu = () => {
    emit('toggle-sidebar')
}

const isModalOpen = ref(false)

const toggleModal = (state) => {
    if (typeof state === 'boolean') {
        isModalOpen.value = state
    } else {
        isModalOpen.value = !isModalOpen.value
    }
}

const isScrolled = ref(false)

const headerHeight = 60;

const handleScroll = () => {
    const scrolled = window.scrollY > headerHeight
    if (scrolled !== isScrolled.value) {
        isScrolled.value = scrolled
    }
}

onMounted(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
})

</script>

<style lang="scss" scoped></style>