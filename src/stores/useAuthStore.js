import { defineStore } from 'pinia';

import { auth } from '../firebase/config';

import { onAuthStateChanged, signOut } from 'firebase/auth';
import { ref } from 'vue';

export const useAuthStore = defineStore('useAuthStore', () => {
    const user = ref(null);
    // const isAuthReady = ref(false);

    const initAuth = async () => {
        return await new Promise((resolve) => {
            onAuthStateChanged(auth, (_user) => {
                user.value = _user || null
                // isAuthReady.value = true
                resolve(_user)
            })
        })
    }

    const error = ref(null);
    const isPending = ref(false);

    const logOutUser = async () => {
        error.value = null;
        isPending.value = true;

        try {
            await signOut(auth);

            console.log('loggin iyt')
            return true;
        } catch (err) {
            error.value = err.message;
        } finally {
            isPending.value = false;
        }
    };

    return {
        user,
        // isAuthReady,
        initAuth,
        error,
        isPending,
        logOutUser,
    };
});
