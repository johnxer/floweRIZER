<template>
    <div>
        <chat-floating-button
            @click="toggleChat"
            :class="{'hover:scale-110' : !isChatShown,}"
            :tooltip-content="tooltipContentText"
        />
        <transition name="fade" mode="out-in">
            <div
                v-if="isChatShown"
                class="fixed bottom-[176px] md:bottom-22 right-6 w-84 h-120 bg-white dark:bg-gray-900 shadow-xl rounded-xl border border-gray-100 dark:border-gray-950"
            >
                <chat-window-wrapper />
            </div>
        </transition>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import ChatFloatingButton from './ChatFloatingButton.vue';
import ChatWindowWrapper from './ChatWindowWrapper.vue';

const isChatShown = ref(false)

const tooltipContentText = computed(() => {
    return isChatShown.value ? 'Minimize chat' : 'Open chat'
})

const toggleChat = () => {
    isChatShown.value = !isChatShown.value
}


</script>

<style lang="scss" scoped></style>