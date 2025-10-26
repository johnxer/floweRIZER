<template>
    <div>
        <chat-floating-button @click="showChat" /> 

        <transition
            name="fade"
            mode="out-in"
        >
            <chat-window-wrapper v-if="isChatShown" />
        </transition>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import ChatFloatingButton from './ChatFloatingButton.vue';
import ChatWindowWrapper from './ChatWindowWrapper.vue';

const isChatShown = ref(false)

const showChat = () => {
  isChatShown.value = !isChatShown.value
}

</script>

<style lang="scss" scoped></style>