import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from 'firebase/firestore/lite';

const firebaseConfig = {
    apiKey: "AIzaSyBHImoa2lgKC290vPJahVqEsnf7BwdVSfk",
    authDomain: "erkfolio.firebaseapp.com",
    projectId: "erkfolio",
    storageBucket: "erkfolio.appspot.com",
    messagingSenderId: "298624345813",
    appId: "1:298624345813:web:5c661ca53ca5236a83a45c",
    measurementId: "G-C2CELDQ7KC"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const auth = getAuth();
const provider = new GoogleAuthProvider();

export const db = getFirestore(app);
export const storage = getStorage(app);

export const signInWithGoogle = () => signInWithPopup(auth, provider)