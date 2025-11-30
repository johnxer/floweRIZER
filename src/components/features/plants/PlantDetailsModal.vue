<template>
    <base-modal-content>
        <template #modalTitle>
            <span class="noto-color-emoji-regular mr-2">🌱</span>
            {{ detailsPlant?.name }}'{{ plantNameLastLetter ? '' : 's' }} details
        </template>
        <div class="relative">
            <Tabs v-model="activeTabName">
                <TabsList>
                    <TabsTrigger
                        v-for="tab in tabs"
                        :key="tab.name"
                        :value="tab.name"
                    >
                        {{ tab.label }}
                    </TabsTrigger>
                </TabsList>
                <TabsContent :value="activeTabName">
                    <KeepAlive>
                        <component
                            :is="currentTab"
                            :data="detailsPlant"
                            :isPending="isPendingPlant"
                            :error="errorPlant"
                            :room-id="props.roomId"
                            :plant-id="props.plantId"
                            :plant-name="detailsPlant?.name"
                        />
                    </KeepAlive>
                </TabsContent>
            </Tabs>
        </div>
    </base-modal-content>
</template>


<script setup>
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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