<template>
    <Button
        type="button"
        @click="handleAddPlant"
        class="gap-0 py-1 pl-1 pr-3 md:pr-0 inline-flex align-top items-center leading-none justify-center md:justify-start w-auto md:w-auto"
        size="custom"
        variant="hover-outline"
    >
        <span class="material-symbols-outlined text-xl mr-1">
            add
        </span>
        <span
            class="transition-all duration-400 text-sm flex"
            :class="existPlants ? 'md:w-0 group-hover/card:w-[42px] overflow-hidden' : 'w-[42px]'"
        >
            Plant
        </span>
    </Button>
</template>

<script setup lang="ts">

import { Button } from "@/components/ui/button";

import { useUIStore } from "@/stores/useUIStore";

type Props = {
    roomId: string;
    existPlants?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    existPlants: true
})

const handleAddPlant = () => {
    uiStore.openModal('plant', { roomId: props.roomId })
}

const uiStore = useUIStore()
</script>

<style lang="scss"></style>