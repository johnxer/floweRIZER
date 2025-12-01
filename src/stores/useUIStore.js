import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useUIStore = defineStore('useUIStore', () => {
    const isMultiSelectEnabled = ref(false);

    const selectedPlants = ref(new Set());

    const isMinOnePlantSelected = computed(() => selectedPlants.value.size > 0);

    const plantSelectedList = ref([]);

    const togglePlantSelection = ({ plantId, roomId }) => {
        const newSet = new Set(selectedPlants.value);
        if (newSet.has({ plantId, roomId })) {
            newSet.delete({ plantId, roomId });
        } else {
            newSet.add({ plantId, roomId });
        }
        selectedPlants.value = newSet;

        plantSelectedList.value = [...newSet];

        console.log(plantSelectedList.value);
    };

    const clearSelection = () => {
        selectedPlants.value = new Set();
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
