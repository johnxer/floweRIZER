import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useScrollStore = defineStore('useScrollStore', () => {
    const scrollTarget = ref({
        type: null,
        roomId: null,
        plantId: null,
    });

    const setScrollTarget = ({ type = 'room', roomId = null, plantId = null }) => {
        scrollTarget.value = { type, roomId, plantId };
    };

    const clearScrollTarget = () => {
        scrollTarget.value = { type: null, roomId: null, plantId: null };
    };

    return {
        scrollTarget,
        setScrollTarget,
        clearScrollTarget,
    };
});
