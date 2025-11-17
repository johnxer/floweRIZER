import { defineStore } from 'pinia';


import { ref } from 'vue';

export const useAuthStore = defineStore('useAuthStore', () => {
    const user = ref(null);
    const error = ref(null);
    const isPending = ref(false);

    const isLogin = ref(true);
    const showPwRecovery = ref(false);

    return {
        user,
        error,
        isPending,
        isLogin,
        showPwRecovery
    };
});
