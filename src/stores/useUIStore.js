import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useUIStore = defineStore('useUIStore', () => {
    const isMultiSelectEnabled = ref(false);

    const selectedPlants = ref(new Map());

    const isMinOnePlantSelected = computed(() => selectedPlants.value.size > 0);

    const plantSelectedList = computed(() => [...selectedPlants.value.values()]);

    const togglePlantSelection = ({ plantId, roomId }) => {
        const key = `${roomId}_${plantId}`;
        const newMap = new Map(selectedPlants.value);
        if (newMap.has(key)) {
            newMap.delete(key);
        } else {
            newMap.set(key, { plantId, roomId });
        }
        selectedPlants.value = newMap;
    };

    const clearSelection = () => {
        selectedPlants.value = new Map();
    };

    const headerHeight = 60;

    const activeModal = ref(null);
    const selectedModalData = ref({});

    const openModal = (name, data = {}) => {
        activeModal.value = name;

        selectedModalData.value = data;
    };

    const closeModal = () => {
        activeModal.value = null;
        selectedModalData.value = {};
    };

    return {
        headerHeight,
        activeModal,
        selectedModalData,
        openModal,
        closeModal,
        isMultiSelectEnabled,
        isMinOnePlantSelected,
        selectedPlants,
        togglePlantSelection,
        clearSelection,
        plantSelectedList,
    };
});
