import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyAH-yvn7OR3JJ3kDxxAMUgVuqqIYN6N5do",
  authDomain: "juris-zap.firebaseapp.com",
  projectId: "juris-zap",
  storageBucket: "juris-zap.firebasestorage.app",
  messagingSenderId: "1034619440617",
  appId: "1:1034619440617:web:93d5b6d1f872bafa0d0f78",
  measurementId: "G-34TJW1HR71"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };