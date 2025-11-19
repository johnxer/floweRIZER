import { onAuthStateChanged, signOut, updateProfile } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase/config';
import { useAuthStore } from '../../stores/useAuthStore';

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
