<template>
    <div>
        <base-floating-button
            class="bottom-6 text-2xl"
            @click="toggleChat"
            :class="{ 'hover:scale-110': !showChat }"
            :tooltip-content="tooltipContentText"
        >
            <span class="material-symbols-outlined">
                chat_bubble
            </span>
        </base-floating-button>
        <transition
            name="chat-slide"
            mode="out-in"
        >
            <div
                v-if="showChat"
                class="fixed bottom-[calc(var(--bottomBarHeight)_+_var(--spacing)_*_2)] md:bottom-22 md:right-6 w-[calc(100vw_-_var(--spacing)_*_4)] md:w-84 mx-2 md:mx-auto md:h-120 top-2 md:top-auto bg-white dark:bg-gray-900 shadow-xl rounded-xl z-4 transition-all"
            >
                <chat-window-wrapper />
            </div>

        </transition>

        <teleport to="body">
            <transition
                name="fade"
                mode="out-in"
            >
                <div
                    v-if="showChat"
                    class="modal-backdrop fixed inset-0"
                />
            </transition>
        </teleport>
    </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';

import BaseFloatingButton from '../Base/BaseButtons/BaseFloatingButton.vue';

import ChatWindowWrapper from './ChatWindowWrapper.vue';

const props = defineProps({
    isChatOpen: {
        type: Boolean,
        required: true
    }
})


const isChatShown = ref(false)

const showChat = computed(() => props.isChatOpen || isChatShown.value)

const tooltipContentText = computed(() => {
    return isChatShown.value ? 'Minimize chat' : 'Open chat'
})

const toggleChat = () => {
    isChatShown.value = !isChatShown.value
}

watch(showChat, newVal => {
    if (newVal === true) {
        document.querySelector('body').classList.add('overflow-y-hidden')
    } else {
        document.querySelector('body').classList.remove('overflow-y-hidden')

    }
})




</script>

<style lang="scss" scoped></style>