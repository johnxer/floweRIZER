import { defineStore } from 'pinia';

import { auth, db } from '../firebase/config';

import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { ref } from 'vue';

export const useAuthStore = defineStore('useAuthStore', () => {
    const user = ref(null);
    const error = ref(null);
    const isPending = ref(false);

    const initAuth = async () => {
        return await new Promise((resolve) => {
            onAuthStateChanged(auth, async (_user) => {
                if (_user) {
                    user.value = _user;

                    try {
                        const userReference = doc(db, 'users', _user.uid);
                        const userSnapshot = await getDoc(userReference);

                        const lastSignIn = new Date(_user.metadata.lastSignInTime)
                        const lastLoginStored = userSnapshot.exists() ? userSnapshot.data().lastLogin?.toDate?.() : null

                        if (!userSnapshot.exists()) {
                            await setDoc(userReference, {
                                email: _user.email,
                                displayName: _user.displayName || '',
                                photoUrl: _user.photoURL || '',
                                createdAt: serverTimestamp(),
                                lastLogin: serverTimestamp(),
                            });
                            console.log('New user profile created in Firestore');
                        } else if(!lastLoginStored || lastSignIn > lastLoginStored) {
                            await setDoc(userReference, { lastLogin: serverTimestamp() }, { merge: true });
                            console.log('Updated user last login in Firestore');
                        } else {
                            console.log('Session restored — skipping lastLogin update')

                        }
                    } catch (err) {
                        error.value = err.message;
                    }
                    resolve(_user);
                } else {
                    user.value = null;
                    resolve(null);
                }
            });
        });
    };

    const logOutUser = async () => {
        error.value = null;
        isPending.value = true;

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

    return {
        user,
        // isAuthReady,
        initAuth,
        error,
        isPending,
        logOutUser,
    };
});
