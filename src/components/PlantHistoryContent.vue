<template>

    <base-modal-content>
        <template #modalTitle>
            History log
        </template>
        <div class="relative">
            <base-loader
                v-if="isPendingPlant"
                position-type="absolute"
                class="bg-white/80 dark:bg-gray-800/80 z-1"
            >
                Loading history...
            </base-loader>

            <div v-else>
                <ul class="flex flex-col gap-4">
                    <li class="grid grid-cols-2">
                        <div class="text-gray-400 dark:text-gray-600">
                            {{ formattedDate }}

                        </div>
                        <div class="text-gray-600 dark:text-gray-500 text-lg">
                            <span class="noto-color-emoji-regular text-base">🪴</span> Plant added
                        </div>
                    </li>
                    <li
                        v-for="action in formattedActions"
                        :key="action.id"
                        class="grid grid-cols-2"
                    >
                        <div class="text-gray-400 dark:text-gray-600">
                            {{ action.formattedDate }}

                        </div>
                        <div class="text-gray-600 dark:text-gray-500 capitalize text-lg">
                            <span class="noto-color-emoji-regular text-base">
                            {{ action.emojiIcon }}
                            </span> {{ action.action }}
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </base-modal-content>
</template>

<script setup>
import { format } from "date-fns";

import { useGetDetails } from '../composables/useGetDetail';
import { usePlantsStore } from '../stores/usePlantsStore';

import { computed } from "vue";
import BaseLoader from './Base/BaseLoader.vue';
import BaseModalContent from './Base/BaseModal/BaseModalContent.vue';


const plantsStore = usePlantsStore()

const formattedDate = computed(() => {
    const createdAt = detailsPlant.value?.createdAt
    return createdAt?.toDate ? format(createdAt.toDate(), 'MMM d, yyyy') : '—'
})

const actionEmojiMap = {
    watered: {
        emoji: '💧'
    }
}

const formattedActions = computed(() => {
    const log = detailsPlant.value?.log;

    if (!log?.length) return []

    return log.map(a => {
        const date = a.date?.toDate ? a.date?.toDate() : new Date(a.date)
        const emoji = actionEmojiMap[a.action]?.emoji || ''

        return {
            ...a,
            emojiIcon: emoji,
            formattedDate: format(date, 'MMM d, yyyy')
        }
    })

})

const {
    error: errorPlant,
    isPending: isPendingPlant,
    details: detailsPlant,
} = useGetDetails(`rooms/${plantsStore.selectedRoomId}/plants/${plantsStore.selectedPlantId}`)

</script>

<style lang="scss" scoped></style>