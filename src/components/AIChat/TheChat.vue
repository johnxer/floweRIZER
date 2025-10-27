<template>
    <div>
        <chat-floating-button
            @click="showChat"
            :class="{'hover:scale-110' : !isChatShown,}"
            :tooltip-content="tooltipContentText"
        />

        <transition
            name="fade"
            mode="out-in"
        >
            <div v-if="isChatShown">
                <Suspense>
                    <chat-window-wrapper />

                    <template #fallback>
                        <div class="fixed bottom-22 right-6 w-84 h-120 bg-white dark:bg-gray-900 shadow-xl rounded-xl border border-gray-100 dark:border-gray-950 flex justify-center items-center">
                            <p>Loading chat...</p>
                        </div>
                    </template>
                </Suspense>
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

const showChat = () => {
    isChatShown.value = !isChatShown.value
}


</script>

<style lang="scss" scoped></style>