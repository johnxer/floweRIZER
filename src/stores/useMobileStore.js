import { defineStore } from 'pinia';
import { computed, onMounted, onUnmounted, ref } from 'vue';

export const useMobileStore = defineStore('mobile', () => {
    const width = ref(window.innerWidth);
    const isMobile = computed(() => width.value < 768);

    const updateWidth = () => (width.value = window.innerWidth);

    onMounted(() => window.addEventListener('resize', updateWidth));
    onUnmounted(() => window.removeEventListener('resize', updateWidth));

    return {
        isMobile,
    };
});
