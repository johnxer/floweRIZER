import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { ref } from 'vue';
import { auth } from '../firebase/config';

export const useLogIn = () => {
    const error = ref(null);
    const isPending = ref(false);
    // const authedUser = ref(null)

    const logInUser = async (data) => {
        isPending.value = true;

        try {
            const response = await signInWithEmailAndPassword(auth, data.email, data.password);

            console.log(response.user)

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
        logInUser
    }
};

export const useSignUp = () => {
    const error = ref(null);
    const isPending = ref(false);
    // const newUser = ref(null);

    const signUpUser = async (data) => {
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
        // newUser,
        signUpUser,
    };
};
