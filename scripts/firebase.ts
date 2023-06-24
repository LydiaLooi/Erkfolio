import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from 'firebase/firestore/lite';

import { initializeAuth, indexedDBLocalPersistence, browserLocalPersistence, browserSessionPersistence, browserPopupRedirectResolver, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

import { getLogger } from "../logging/log-util";

const logger = getLogger("Firebase")

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: "erkfolio.firebaseapp.com",
    projectId: "erkfolio",
    storageBucket: "erkfolio.appspot.com",
    messagingSenderId: "298624345813",
    appId: "1:298624345813:web:5c661ca53ca5236a83a45c",
    measurementId: "G-C2CELDQ7KC"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
    persistence: [
        indexedDBLocalPersistence,
        browserLocalPersistence,
        browserSessionPersistence
    ],
});


const provider = new GoogleAuthProvider();

export const db = getFirestore(app);
export const storage = getStorage(app);

export function signInWithGoogle() {
    // signInWithPopup(auth, provider)
    signInWithPopup(auth, provider, browserPopupRedirectResolver).then(() => { logger.info("Logged in successfully") }).catch((e) => { logger.warn("Cancelled popup") }) // https://github.com/firebase/firebase-js-sdk/issues/4946#issuecomment-921147692
}