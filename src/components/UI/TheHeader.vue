<template>
    <header
        class="px-4 md:px-6 sticky top-0 z-2 transition-all"
        :class="{ 'bg-gray-100 dark:bg-gray-950 shadow-2xl': isScrolled }"
    >
        <div class="container mx-auto flex items-center justify-between header-min-h">
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
                <div class="flex md:gap-4 items-center">
                    <v-dropdown trap-focus>
                        <button
                            class="relative transition-colors duration-600 flex p-2"
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
                                        class="border-b last:border-0 border-gray-200 dark:border-gray-800 pb-2 mb-2 last:pb-0 last:mb-0"
                                    >
                                        <div class="flex gap-2 items-start">
                                            <span class="material-symbols-outlined text-xl text-gray-300 dark:text-gray-500 relative -top-[1px]">
                                                info
                                            </span>
                                            <div
                                                v-html="notification.action"
                                                class="text-gray-600 dark:text-gray-500"
                                            />
                                        </div>
                                        <div class="text-end flex justify-end gap-6">
                                            <button
                                                type="button"
                                                class="mt-2 cursor-pointer transition-all duration-600 text-primary-500 hover:text-primary-700 dark:hover:text-primary-700 inline-flex align-top items-center gap-1"
                                                @click="handleWatering(notification.id)"
                                                v-close-popper="isLastNotification"
                                            >
                                                <span class="material-symbols-outlined text-lg">
                                                    humidity_high
                                                </span>
                                                <span>
                                                    Water plant
                                                </span>
                                            </button>
                                            <!-- <button
                                                type="button"
                                                class="mt-2 text-gray-500 hover:text-gray-700 transition-all duration-600 inline-flex align-top cursor-pointer"
                                                @click="handleDismissNotification(notification.id)"
                                            >
                                                Dismiss
                                            </button> -->
                                        </div>
                                    </li>
                                </transition-group>
                            </div>
                        </template>
                    </v-dropdown>

                    <v-dropdown
                        trap-focus
                        popper-class="popper-slide"
                    >
                        <button
                            v-tooltip="{
                                content: themeStore.activeThemeTooltip,
                                container: 'body'
                            }"
                            class="relative transition-colors duration-600 flex p-2 cursor-pointer text-gray-400 dark:text-gray-600 hover:dark:text-primary-600"
                        >
                            <span class="material-symbols-outlined text-2xl">
                                {{ themeStore.activeThemeIcon }}
                            </span>
                        </button>
                        <template #popper>
                            <div class="text-base max-w-[300px] font-normal p-6">
                                <ul class="text-sm space-y-3">
                                    <li>
                                        <button
                                            type="button"
                                            class="hover:text-primary-500 cursor-pointer transition-colors duration-600 block py-2 flex gap-2 items-center text-base"
                                            :class="themeStore.activeTheme === 'light' ? 'text-primary-500' : 'text-gray-600'"
                                            v-close-popper="true"
                                            @click="themeStore.handleSetTheme('light')"
                                        >
                                            <span class="material-symbols-outlined text-3xl">
                                                light_mode
                                            </span>
                                            Light theme
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            type="button"
                                            class="hover:text-primary-500 cursor-pointer transition-colors duration-600 block py-2 flex gap-2 items-center text-base"
                                            :class="themeStore.activeTheme === 'dark' ? 'text-primary-500' : 'text-gray-600'"
                                            v-close-popper="true"
                                            @click="themeStore.handleSetTheme('dark')"
                                        >
                                            <span class="material-symbols-outlined text-3xl">
                                                dark_mode
                                            </span>
                                            Dark theme
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            type="button"
                                            class="hover:text-primary-500 cursor-pointer transition-colors duration-600 block py-2 flex gap-2 items-center text-base"
                                            :class="themeStore.activeTheme === 'default' ? 'text-primary-500' : 'text-gray-600'"
                                            v-close-popper="true"
                                            @click="themeStore.handleSetTheme('default')"
                                        >
                                            <span class="material-symbols-outlined text-3xl">
                                                brightness_medium
                                            </span>
                                            Device default
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </template>
                    </v-dropdown>


                    <base-button
                        v-if="isShown"
                        @click="roomStore.openAddModal"
                        btn-style="notRoundedMd"
                        btn-size="sm"
                        :btn-full-width="false"
                    >
                        New room
                    </base-button>
                    <div class="md:hidden">
                        <button
                            class="text-gray-400 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-900 cursor-pointer transition-colors duration-600 flex p-2"
                            @click="handlelogout"
                        >
                            <span class="material-symbols-outlined text-2xl">
                                logout
                            </span>
                        </button>

                    </div>
                    <div class="hidden md:flex">
                        <v-dropdown
                            trap-focus
                            popper-class="popper-slide"
                            @show="onShow"
                            @hide="onHide"
                        >
                            <button class="relative transition-colors duration-600 flex p-2 cursor-pointer text-gray-400 dark:text-gray-600 hover:dark:text-primary-600">
                                <transition
                                    name="icon-fade"
                                    mode="out-in"
                                >
                                        

                                    <span
                                        v-if="isOpen"
                                        key="close"
                                        class="material-symbols-outlined text-2xl transition-transform duration-500 rotate-180"
                                    >
                                        close
                                    </span>
                                    <span
                                        v-else
                                        key="menu"
                                        class="material-symbols-outlined text-2xl transition-transform duration-500 rotate-0"
                                    >
                                        menu
                                    </span>
                                </transition>
                            </button>
                            <template #popper>
                                <div class="text-base max-w-[300px] font-normal p-6">
                                    <ul class="space-y-3">
                                        <menu-content />
                                        <li>
                                            <button
                                                class="text-gray-600 hover:text-red-500 cursor-pointer transition-colors duration-600 py-2 flex gap-2 items-center"
                                                v-close-popper="true"
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
                        </v-dropdown>
                    </div>
                </div>
            </div>
        </div>
    </header>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, useSlots } from 'vue';
import { useGetDataByUserId } from '../../composables/useGetData';

import { differenceInDays } from 'date-fns';

import { useRoute } from 'vue-router';
import { useFindRoomIdByPlantId } from '../../composables/useFindRoomIdByPlantId';
import { useUpdateData } from '../../composables/useUpdateData';
import { useRoomsStore } from '../../stores/useRoomsStore';
import { useThemeStore } from '../../stores/useThemeStore';

import BaseButton from '../Base/BaseButton.vue';

import { useMobileStore } from '../../stores/useMobileStore';
import MenuContent from '../MenuContent.vue';

const props = defineProps({
    projectTitle: {
        type: String,
        required: true
    },
})

const mobileStore = useMobileStore();

const roomStore = useRoomsStore()

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

const {
    findRoomIdByPlantId
} = useFindRoomIdByPlantId()


const {
    error: errorUpdateData,
    isPending: isPendingUpdateData,
    waterPlant
} = useUpdateData()

const route = useRoute()

const themeStore = useThemeStore()

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

        const objekt = {
            ...n,
            action: typeD ? typeD.action.replace('##plantName##', `<strong>${n.name}</strong>`) : 'Unknown action'
        }

        return objekt
    })
})

const isScrolled = ref(false)

const headerHeight = 60;

const handleScroll = () => {
    const scrolled = window.scrollY > headerHeight
    if (scrolled !== isScrolled.value) {
        isScrolled.value = scrolled
    }
}

document.documentElement.style.setProperty('--headerHeight', `${headerHeight}px`)

const handleWatering = async (plantId) => {
    await waterPlant(plantId)
}

const isLastNotification = computed(() => {
    return notifications.value.length < 2
})

const isShown = computed(() => route.name === 'TheDashboard' && !mobileStore.isMobile)

onMounted(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
})


const isOpen = ref(false)

const onShow = () => (isOpen.value = true)
const onHide = () => (isOpen.value = false)

</script>

<style lang="scss" scoped></style>