import { createUserWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { ref } from 'vue';
import { auth, db } from '../firebase/config';
import { useAuthStore } from '../stores/useAuthStore';

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

export const useAuth = () => {
    const authStore = useAuthStore();

    const initAuth = async () => {
        return await new Promise((resolve) => {
            onAuthStateChanged(auth, async (_user) => {
                if (_user) {
                    authStore.user = {
                        uid: _user.uid,
                        email: _user.email,
                        displayName: _user.displayName,
                        photoURL: _user.photoURL || '',
                        metadata: _user.metadata,
                    };

                    try {
                        const userReference = doc(db, 'users', _user.uid);
                        const unassignedRoomReference = doc(db, `users/${_user.uid}/rooms/unassigned`);
                        const userSnapshot = await getDoc(userReference);

                        const lastSignIn = new Date(_user.metadata.lastSignInTime);
                        const lastLoginStored = userSnapshot.exists() ? userSnapshot.data().lastLogin?.toDate?.() : null;

                        if (!userSnapshot.exists()) {
                            await setDoc(userReference, {
                                email: _user.email,
                                displayName: _user.displayName || '',
                                photoUrl: _user.photoURL || '',
                                createdAt: serverTimestamp(),
                                lastLogin: serverTimestamp(),
                            });

                            await setDoc(unassignedRoomReference, {
                                name: 'Unassigned',
                                createdAt: serverTimestamp(),
                                isSystem: true,
                            });
                        } else if (!lastLoginStored || lastSignIn > lastLoginStored) {
                            await setDoc(userReference, { lastLogin: serverTimestamp() }, { merge: true });
                            console.log('Updated user last login in Firestore');
                        } else {
                            console.log('Session restored — skipping lastLogin update');
                        }
                    } catch (err) {
                        authStore.error = err.message;
                    }
                    resolve(_user);
                } else {
                    authStore.user = null;
                    resolve(null);
                }
            });
        });
    };

    const logOutUser = async () => {
        authStore.error = null;
        authStore.isPending = true;

        try {
            await signOut(auth);

            console.log('User is logging out');
            return true;
        } catch (err) {
            authStore.error = err.message;
        } finally {
            authStore.isPending = false;
        }
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

    const getUid = () => {
        const uid = authStore.user?.uid;

        if (!uid) {
            error.value = 'User not authenticated';
            return null;
        }

        return uid;
    };

    return {
        initAuth,
        logOutUser,
        updateProfileData,
        getUid
    };
};
