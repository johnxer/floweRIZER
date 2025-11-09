import { defineStore } from 'pinia';
import { ref } from 'vue';

export const usePlantsStore = defineStore('usePlantsStore', () => {
    const wateredNow = ref({});

    const markAsWatered = (plantId) => {
        wateredNow.value[plantId] = true;
    };

    const isWateredNow = (plantId) => wateredNow.value[plantId] || false;

    const isModalOpenPlant = ref(false);

    const toggleModal = (state) => {
        if (typeof state === 'boolean') {
            isModalOpenPlant.value = state;
        } else {
            isModalOpenPlant.value = !isModalOpenPlant.value;
        }
    };

    const selectedRoomId = ref(null);
    const selectedPlantId = ref(null);

    const openAddModal = (roomId) => {
        selectedRoomId.value = roomId;
        selectedPlantId.value = null;
        toggleModal(true);
    };

    const openEditModal = (roomId, plantId) => {
        selectedRoomId.value = roomId;
        selectedPlantId.value = plantId;
        toggleModal(true);
    };

    const closePlantModal = () => {
        toggleModal(false);
        selectedRoomId.value = null
        selectedPlantId.value = null;
    };

    return {
        wateredNow,
        markAsWatered,
        isWateredNow,
        isModalOpenPlant,
        selectedRoomId,
        selectedPlantId,
        openAddModal,
        openEditModal,
        closePlantModal
    };
});
