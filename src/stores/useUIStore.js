import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUIStore = defineStore('useUIStore', () => {
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
        activeModal,
        selectedModalData,
        openModal,
        closeModal,
    };  
});
