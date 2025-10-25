import { defineStore } from 'pinia';

import { auth } from '../firebase/config';

import { onAuthStateChanged } from 'firebase/auth';
import { ref } from 'vue';

// export const useAuthSore = defineStore('useAuthStore', {
//   state: () => ({ count: 0 }),
//   actions: {
//     increment() {
//       this.count++
//     },
//   },
// })

// export const useAuthSore = defineStore('useAuthStore', {
//   state: () => ({
//     user: null,
//   }),

//   actions: {
//     init() {
//       onAuthStateChanged(auth, (user) => {
//         this.user = user;
//       });
//     },
//   },

//   getters: {
//     isAuthenticated: (state) => !!state.user,
//   },
// })

export const useAuthStore = defineStore('useAuthStore', () => {
    const user = ref(null);
    const isAuthReady = ref(false);
    const unsubscribe = ref(null);

    const initAuth = () => {
        if (unsubscribe.value) return;

        unsubscribe.value = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                user.value = firebaseUser;
            } else {
                user.value = null;
            }
            isAuthReady.value = true;
        });
    };

    onUnmounted(() => {
        if (unsubscribe.value) {
            unsubscribe.value();
            unsubscribe.value = null;
        }
    });

    const error = ref(null);
    const isPending = ref(false);

    const logOutUser = async () => {
        error.value = null;
        isPending.value = true;

        try {
            await signOut(auth);

            return true;
        } catch (err) {
            error.value = err.message;
        } finally {
            isPending.value = false;
        }
    };

    return {
        user,
        isAuthReady,
        initAuth,
        error,
        isPending,
        logOutUser,
    };
});
