import { ref } from 'vue';

import { auth, db } from '@/firebase/config';
import { createUserWithEmailAndPassword, deleteUser, EmailAuthProvider, reauthenticateWithCredential, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useRouter } from 'vue-router';

import { useAuthStore } from '@/stores/useAuthStore';

export const useAuthActions = () => {
    const router = useRouter();
    const authStore = useAuthStore();
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
                photoURL: user.photoURL || '',
                createdAt: serverTimestamp(),
                lastLogin: serverTimestamp(),
                theme: 'default',
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

    const userReauthenticate = async (email, password) => {
        const credential = EmailAuthProvider.credential(email, password);

        error.value = null;

        try {
            await reauthenticateWithCredential(auth.currentUser, credential);

            return true;
        } catch (err) {
            if (err.code === 'auth/invalid-credential') {
                error.value = "You've entered wrong password";
            } else {
                error.value = err.message;
            }

            return false;
        }
    };

    const userDelete = async () => {
        error.value = null;
        isPending.value = true;

        const user = auth.currentUser;

        if (!user) {
            error.value = 'User not logged in.';
            isPending.value = false;
            return false;
        }

        try {
            await deleteUser(user);
            return true;
        } catch (err) {
            if (err.code === 'auth/requires-recent-login') {
                error.value = 'Please log in again to delete your account.';
            } else {
                error.value = err.message;
            }

            return false;
        } finally {
            isPending.value = false;
        }
    };

    // const userChangePassword = async () => {
    //     error.value = null;
    //     isPending.value = true;

    //     const user = auth.currentUser;

    //     if (!user) {
    //         error.value = 'User not logged in.';
    //         isPending.value = false;
    //         return false;
    //     }

    //     try {
    //         // updatePassword(user, newPassword);
    //         updatePassword(user, '123123123123');
    //         return true;
    //     } catch (err) {
    //         if (err.code === 'auth/requires-recent-login') {
    //             error.value = 'Please log in again to delete your account.';
    //         } else {
    //             error.value = err.message;
    //         }

    //         console.log(error.value);
    //         return false;
    //     } finally {
    //         isPending.value = false;
    //     }
    // };

    const logOutUser = async () => {
        authStore.error = null;
        authStore.isPending = true;

        try {
            await signOut(auth);

            console.log('User is logging out');
            return true;
        } catch (err) {
            error.value = err.message;
        } finally {
            isPending.value = false;
        }
    };

    const handleLogout = async () => {
        await logOutUser();
        router.push({ name: 'TheLogin' });
    };

    const updateProfileData = async (data) => {
        try {
            await updateProfile(auth.currentUser, data);

            authStore.user = { ...authStore.user, ...data };

            return true;
        } catch (err) {
            authStore.error = err.message;
            return false;
        } finally {
            authStore.isPending = false;
        }
    };

    return {
        error,
        isPending,
        logInUser,
        signUpUser,
        resetEmail,
        userReauthenticate,
        userDelete,
        handleLogout,
        updateProfileData,
        // userChangePassword,
    };
};
