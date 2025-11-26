<template>
    <base-modal-content>
        <template #modalTitle>
            <span class="noto-color-emoji-regular mr-2">🌱</span>
            {{ detailsPlant?.name }}'{{ plantNameLastLetter ? '' : 's' }} details
        </template>
        <div class="relative">
            <div class="bg-gray-100 rounded-xl p-2 mb-6">
                <ul class="flex gap-2">
                    <li
                        v-for="tab in tabs"
                        :key="tab.name"
                    >
                        <button
                            type="button"
                            class="px-4 py-2 text-lg rounded-xl text-gray-400 hover:text-gray-600 transition-all duration-600"
                            :class="activeTabName === tab.name ? 'text-gray-600 dark:text-gray-400 bg-white' : 'cursor-pointer'"
                            @click="activeTabName = tab.name"
                        >
                            {{ tab.label }}
                        </button>
                    </li>
                </ul>
            </div>
            <div class="">
                <component
                    :is="currentTab"
                    :data="detailsPlant"
                    :isPending="isPendingPlant"
                    :error="errorPlant"
                />
            </div>
        </div>
    </base-modal-content>
</template>


<script setup>
import { computed, defineAsyncComponent, ref } from 'vue';

import BaseModalContent from '@/components/base/BaseModal/BaseModalContent.vue';

import { useUIStore } from '@/stores/useUIStore';

import { useGetDetails } from '@/composables';


const props = defineProps({
    roomId: {
        type: String,
        required: true
    },
    plantId: {
        type: String,
        required: true
    }
})

const {
    data: detailsPlant,
    error: errorPlant,
    isPending: isPendingPlant,
} = useGetDetails(`rooms/${props.roomId}/plants/${props.plantId}`)


const detailsTab = defineAsyncComponent({
    loader: () => import('./PlantDetailsModalContent.vue'),
    loadingComponent: () => import('@/components/base/BaseLoader.vue'),
    delay: 200
})

const logTab = defineAsyncComponent({
    loader: () => import('./PlantDetailsModalLog.vue'),
    loadingComponent: () => import('@/components/base/BaseLoader.vue'),
    delay: 200
})


const tabs = [
    { name: 'details', label: 'Details', component: detailsTab },
    { name: 'log', label: 'History log', component: logTab }
]

const activeTabName = ref('details')

const currentTab = computed(() => {
    return tabs.find(tab => tab.name === activeTabName.value)?.component
})


const plantNameLastLetter = computed(() => detailsPlant.value?.name?.slice(-1) === 's')

const uiStore = useUIStore()

</script>