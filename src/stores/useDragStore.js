import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useDragStore = defineStore('useDragStore', () => {
    const isDragging = ref(false);
    const draggedItemId = ref(null);

    const startDrag = (id) => {
        isDragging.value = true;
        draggedItemId.value = id;
    };

    const endDrag = () => {
        isDragging.value = false;
        draggedItemId.value = null;
    };

    return {
        isDragging,
        draggedItemId,
        startDrag,
        endDrag,
    };
});
