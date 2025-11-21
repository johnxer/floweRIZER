import { defineStore } from 'pinia';

import { computed, ref } from 'vue';

export const useAuthStore = defineStore('useAuthStore', () => {
    const user = ref(null);
    const error = ref(null);
    const isPending = ref(false);

    const isLogin = ref(true);
    const showPwRecovery = ref(false);

    const uid = computed(() => user.value?.uid || null);

    return {
        user,
        error,
        isPending,
        isLogin,
        isLogin,
        showPwRecovery,
        uid,
    };
});
