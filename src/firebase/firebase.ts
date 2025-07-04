// src/firebase/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { log, logError } from "../utils/logger";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  };

let db;

try {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  log("Firebase zainicjalizowany pomyślnie");
} catch (error) {
  logError("Błąd podczas inicjalizacji Firebase:", error);
  throw error;
}

export { db };
