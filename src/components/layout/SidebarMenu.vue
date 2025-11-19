<template>
    <div class="fixed w-full left-0 bottom-0 bg-white dark:bg-gray-900 px-4 py-1 shadow-menu z-5 flex bottomBar-min-h">
        <ul class="flex gap-10 w-full items-center">
            <menu-content :is-chat-active="isChatActive" />
            <li class="flex w-1/3 justify-center">
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
        </ul>
    </div>
</template>

<script setup>
import { ref } from 'vue';

import MenuContent from './MenuContent.vue';

const emit = defineEmits(['toggle-chat'])

const isChatActive = ref(false)

const handleChat = () => {
    emit('toggle-chat')

    isChatActive.value = !isChatActive.value
}
const bottomBarHeight = 70;

document.documentElement.style.setProperty('--bottomBarHeight', `${bottomBarHeight}px`)

</script>

<style lang="scss" scoped></style>