import { defineStore } from 'pinia';
import { ref } from 'vue';

export const usePlantsStore = defineStore('usePlantsStore', () => {
    const wateredNow = ref({});

    const markAsWatered = (plantId) => {
        wateredNow.value[plantId] = true;
    };

    const isWateredNow = (plantId) => wateredNow.value[plantId] || false;

    const isModalOpenPlant = ref(false);

    const isModalOpenHistory = ref(false);

    const toggleModal = (state, modalType) => {
        if (typeof state === 'boolean') {
            modalType.value = state;
        } else {
            modalType.value = !isModalOpenPlant.value;
        }
    };

    const selectedRoomId = ref(null);
    const selectedPlantId = ref(null);

    const openAddModal = (roomId) => {
        selectedRoomId.value = roomId;
        selectedPlantId.value = null;
        toggleModal(true, isModalOpenPlant);
    };

    const openEditModal = (roomId, plantId) => {
        selectedRoomId.value = roomId;
        selectedPlantId.value = plantId;
        toggleModal(true, isModalOpenPlant);
    };

    const openHistoryModal = (roomId, plantId) => {
        selectedRoomId.value = roomId;
        selectedPlantId.value = plantId;
        toggleModal(true, isModalOpenHistory);
    };

    const closePlantModal = () => {
        toggleModal(false, isModalOpenPlant);
        selectedRoomId.value = null
        selectedPlantId.value = null;
    };

    const closeHistoryModal = () => {
        toggleModal(false, isModalOpenHistory);
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
        closePlantModal,
        isModalOpenHistory,
        openHistoryModal,
        closeHistoryModal
    };
});
