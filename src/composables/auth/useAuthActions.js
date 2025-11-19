import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { ref } from 'vue';
import { auth, db } from '../../firebase/config';

export const useAuthActions = () => {
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

    const signUpUser = async (data) => {
        error.value = null;
        isPending.value = true;

        try {
            const response = await createUserWithEmailAndPassword(auth, data.email, data.password);
            const user = response.user;

            const userReference = doc(db, 'users', user.uid);

            await setDoc(userReference, {
                email: user.email,
                displayName: data.username || '',
                photoUrl: user.photoURL || '',
                createdAt: serverTimestamp(),
                lastLogin: serverTimestamp(),
            });

            const unassignedRoomReference = doc(db, `users/${user.uid}/rooms/unassigned`);

            await setDoc(unassignedRoomReference, {
                name: 'Unassigned',
                createdAt: serverTimestamp(),
                isSystem: true,
            });

            return user;
        } catch (err) {
            error.value = err.message;
        } finally {
            isPending.value = false;
        }
    };

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
        logInUser,
        signUpUser,
        resetEmail,
    };
};
