<template>
    <base-modal-content>
        <template #modalTitle>
            <span class="noto-color-emoji-regular mr-2">🌱</span>
            {{ modalTitle }}
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
                            :room-id="roomId"
                            :plant-id="plantId"
                            :plant-name="detailsPlant?.name"
                        />
                    </KeepAlive>
                </TabsContent>
            </Tabs>
        </div>
    </base-modal-content>
</template>


<script setup lang="ts">
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { computed, defineAsyncComponent, ref } from 'vue';

import BaseModalContent from '@/components/base/BaseModal/BaseModalContent.vue';


import { useGetDetails } from '@/composables';

type Props = {
    roomId: string;
    plantId: string;
}

const props = defineProps<Props>();

const {
    data: detailsPlant,
    error: errorPlant,
    isPending: isPendingPlant,
} = useGetDetails(`rooms/${props.roomId}/plants/${props.plantId}`)


type TabName = 'details' | 'log';

type TabItem = {
    name: TabName;
    label: string;
    component: ReturnType<typeof defineAsyncComponent>;
}

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

const tabs: TabItem[] = [
    { name: 'details', label: 'Details', component: detailsTab },
    { name: 'log', label: 'History log', component: logTab }
]

const activeTabName = ref<TabName>('details')

const currentTab = computed(() => {
    return tabs.find(tab => tab.name === activeTabName.value)?.component ?? detailsTab;
})

const modalTitle = computed(() => {
    const plantName = detailsPlant.value?.name;
    if (!plantName) return 'Plant details'
    return plantName.endsWith('s') ? `${plantName}' details` : `${plantName}'s details`
})


</script>