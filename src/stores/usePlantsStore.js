import { defineStore } from 'pinia';
import { ref } from 'vue';

export const usePlantStore = defineStore('usePlantStore', () => {
    const wateredNow = ref({});

    const markAsWatered = (plantId) => {
        wateredNow.value[plantId] = true;
    };

    const isWateredNow = (plantId) => wateredNow.value[plantId] || false;

    return {
        wateredNow,
        markAsWatered,
        isWateredNow,
    };
});
