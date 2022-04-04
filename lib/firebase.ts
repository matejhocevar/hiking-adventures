import firebase from 'firebase/compat/app';
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO(matej): Export Firebase config to .env file
const firebaseConfig = {
  apiKey: "AIzaSyDpoAAmQA5D0UjPaMm_uvIlfNgM03giq6I",
  authDomain: "nena-in-blaz.firebaseapp.com",
  projectId: "nena-in-blaz",
  storageBucket: "nena-in-blaz.appspot.com",
  messagingSenderId: "994915430018",
  appId: "1:994915430018:web:3a799122bf9132f2608e9b",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();

export const firestore = getFirestore(app);
export const storage = getStorage(app);
