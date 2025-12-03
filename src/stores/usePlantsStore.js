import { ref } from 'vue';

import { defineStore } from 'pinia';

import { addDelay } from '@/utils';

export const usePlantsStore = defineStore('usePlantsStore', () => {
    const lightIcons = [
        {
            label: 'Low',
            icon: 'cloud',
        },
        {
            label: 'Medium',
            icon: 'partly_cloudy_day',
        },
        {
            label: 'High',
            icon: 'sunny',
        },
    ];

    const setPlantVisible = (plantId, visible) => {
        isPlantVisible.value[plantId] = visible;
    };

    const isPlantVisible = ref({});

    const wateredNow = ref({});

    const markAsWatered = async (plantId) => {
        if (isPlantVisible.value[plantId]) {
            wateredNow.value[plantId] = true;
            await addDelay(1000);
            wateredNow.value[plantId] = false;
        }
    };

    const isWateredNow = (plantId) => wateredNow.value[plantId] || false;

    const activeModal = ref(null);
    const selectedRoomId = ref(null);
    const selectedPlantId = ref(null);

    const openModal = (name, roomId = null, plantId = null) => {
        selectedRoomId.value = roomId;
        activeModal.value = name;
        selectedPlantId.value = plantId;
    };

    const closeModal = () => {
        activeModal.value = null;
        selectedRoomId.value = null;
        selectedPlantId.value = null;
    };

    return {
        lightIcons,
        isPlantVisible,
        setPlantVisible,
        wateredNow,
        markAsWatered,
        isWateredNow,
        activeModal,
        selectedRoomId,
        selectedPlantId,
        openModal,
        closeModal,
    };
});
