import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref } from 'vue';

export const useLogin = () => {};

export const useSignUp = () => {
    // const auth = getAuth();

    const error = ref(null);
    const isPending = ref(false);
    const newUser = ref(null);

    const signUpUser = async () => {
        isPending.value = true;

        try {
            const newUser = await createUserWithEmailAndPassword(auth, email, password);

            return newUser;
        } catch (err) {
            error.value = err.message;
        } finally {
            isPending.value = false;
        }
    };

    return {
        error,
        isPending,
        newUser,
        signUpUser,
    };
};
