import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import { ref } from 'vue';
import { auth } from '../firebase/config';

export const useLogIn = () => {
    const error = ref(null);
    const isPending = ref(false);

    const logInUser = async (data) => {
        error.value = null;

        isPending.value = true;

        try {
            const response = await signInWithEmailAndPassword(auth, data.email, data.password);

            console.log(response.user);

            return response.user;
        } catch (err) {
            error.value = err.message;
        } finally {
            isPending.value = false;
        }
    };

    return {
        error,
        isPending,
        logInUser,
    };
};

export const useSignUp = () => {
    const error = ref(null);
    const isPending = ref(false);

    const signUpUser = async (data) => {
        error.value = null;

        isPending.value = true;

        try {
            const user = await createUserWithEmailAndPassword(auth, data.email, data.password);

            return user;
        } catch (err) {
            error.value = err.message;
        } finally {
            isPending.value = false;
        }
    };

    return {
        error,
        isPending,
        signUpUser,
    };
};

export const usePwReset = () => {
    const error = ref(null);
    const isPending = ref(false);

    const resetEmail = async (email) => {
        error.value = null;

        isPending.value = true;
        try {
            const response = await sendPasswordResetEmail(auth, email);

            console.log(response);
            return true;
        } catch (err) {
            if (err.code === 'auth/user-not-found') {
                error.value = 'No user found with this email.';
            } else if (err.code === 'auth/invalid-email') {
                error.value = 'Invalid email format.';
            } else {
                error.value = err.message;
            }
            return false;
        } finally {
            isPending.value = false;
        }
    };

    return {
        error,
        isPending,
        resetEmail,
    };
};
