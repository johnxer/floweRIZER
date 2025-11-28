<template>
    <base-button
        type="button"
        @click="uiStore.openModal('plant', { roomId: props.roomId })"
        class="mb-2 py-1 px-1 md:pr-0 inline-flex align-top items-center leading-none justify-center md:justify-start w-auto md:w-auto"
        :btn-full-width="false"
        btn-style="notRoundedMd"
        btn-size="custom"
    >
        <span class="material-symbols-outlined text-xl mr-1">
            add
        </span>
        <span
            class="transition-all duration-400 text-sm flex"
            :class="props.existPlants ? 'md:w-0 group-hover/card:w-[42px] overflow-hidden' : 'w-[42px]'"
        >
            Plant
        </span>
    </base-button>

</template>

<script setup>

import { useUIStore } from "@/stores/useUIStore";

import BaseButton from "../../base/BaseButtons/BaseButton.vue";

const props = defineProps({
    roomId: {
        type: String,
        required: true
    },
    existPlants: {
        type: Boolean,
        required: false,
        default: true
    }
})


const uiStore = useUIStore()


</script>

<style lang="sass"></style>