<template>
    <v-dropdown
        trap-focus
        popper-class="popper-slide"
    >
        <button
            v-tooltip="{
                content: themeStore.activeThemeTooltip,
                container: 'body'
            }"
            class="relative transition-colors duration-600 flex p-2 cursor-pointer text-gray-400 dark:text-neutral-600 hover:dark:text-primary-600"
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
</template>

<script setup>
import { useThemeStore } from '@/stores/useThemeStore';

const themeStore = useThemeStore()

</script>

<style lang="scss" scoped></style>