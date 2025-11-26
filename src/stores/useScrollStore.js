import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useScrollStore = defineStore('useScrollStore', () => {
    const scrollTarget = ref({
        type: null,
        roomId: null,
        plantId: null,
        action: null,
    });

    const setScrollTarget = ({ type = 'room', roomId = null, plantId = null, action = null }) => {
        scrollTarget.value = { type, roomId, plantId, action };
    };

    const clearScrollTarget = () => {
        scrollTarget.value = { type: null, roomId: null, plantId: null, action: null };
    };

    return {
        scrollTarget,
        setScrollTarget,
        clearScrollTarget,
    };
});
