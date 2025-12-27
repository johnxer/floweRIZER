import { initializeApp } from 'firebase/app';

import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: 'flower-organizer.firebaseapp.com',
    projectId: 'flower-organizer',
    storageBucket: 'flower-organizer.firebasestorage.app',
    messagingSenderId: '278400679617',
    appId: '1:278400679617:web:4afa2e34fce87e7eb8de40',
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
