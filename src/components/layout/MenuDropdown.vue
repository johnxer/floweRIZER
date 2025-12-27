<template>
    <v-dropdown
        trap-focus
        popper-class="popper-slide"
        @show="onShow"
        @hide="onHide"
    >
        <button class="relative transition-colors duration-600 flex p-2 cursor-pointer text-gray-400 dark:text-neutral-600 hover:dark:text-primary-600">
            <transition
                name="icon-transform"
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
                    <base-menu-link
                        link-destination="TheDashboard"
                        link-icon="potted_plant"
                        link-title="Dashboard"
                        v-close-popper="true"
                        class="w-1/3 md:w-full"
                    />
                    <base-menu-link
                        link-destination="Account"
                        link-icon="face"
                        link-title="Profile"
                        v-close-popper="true"
                        :is-profile="true"
                        class="w-1/3 md:w-full order-3 md:order-2"
                    />
                    <base-menu-link
                        link-destination="AboutProject"
                        link-icon="favorite"
                        link-title="About"
                        v-close-popper="true"
                        class="w-1/3 md:w-full order-3 md:order-2"
                    />
                    <li>
                        <button
                            class="text-foreground hover:text-destructive cursor-pointer transition-colors duration-600 py-2 flex gap-2 items-center"
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
</template>

<script setup lang="ts">

import { ref } from 'vue';

import BaseMenuLink from '@/components/base/BaseMenuLink.vue';

import { useAuthActions } from '@/composables';

import { useMobileStore } from '@/stores/useMobileStore';

const isOpen = ref(false)

type Props = {
    isChatActive?: boolean
}

defineProps<Props>();

const {
    isMobile
} = useMobileStore()
const onShow = () => (isOpen.value = true)
const onHide = () => (isOpen.value = false)


const { handleLogout } = useAuthActions()

</script>

<style lang="scss" scoped></style>