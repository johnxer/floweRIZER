<template>
    <Button
        type="button"
        @click="uiStore.openModal('plant', { roomId: props.roomId })"
        class="gap-0 py-1 px-1 md:pr-0 inline-flex align-top items-center leading-none justify-center md:justify-start w-auto md:w-auto"
        size="custom"
        variant="hover-outline"
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
    </Button>
</template>

<script setup>

import { Button } from "@/components/ui/button";

import { useUIStore } from "@/stores/useUIStore";

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