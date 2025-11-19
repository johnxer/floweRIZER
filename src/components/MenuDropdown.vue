<template>
    <v-dropdown
        trap-focus
        popper-class="popper-slide"
        @show="onShow"
        @hide="onHide"
    >
        <button class="relative transition-colors duration-600 flex p-2 cursor-pointer text-gray-400 dark:text-gray-600 hover:dark:text-primary-600">
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
</template>

<script setup>

import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables'
import MenuContent from './MenuContent.vue'

const isOpen = ref(false)
const router = useRouter()

const onShow = () => (isOpen.value = true)
const onHide = () => (isOpen.value = false)


const { logOutUser } = useAuth()

const handleLogout = async () => {
    await logOutUser()
    router.push({name: 'NotAuthed'})
}


</script>

<style lang="scss" scoped></style>