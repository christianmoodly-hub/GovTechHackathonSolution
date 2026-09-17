import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAuth, type Auth } from "firebase/auth";

function requiredEnv(name: string): string {
  const value =
    process.env[name] ??
    process.env[`EXPO_PUBLIC_${name}`] ??
    process.env[`NEXT_PUBLIC_${name}`];
  if (!value) {
    throw new Error(
      `Missing ${name}. Set it in .env (see .env.example). Never commit API keys.`
    );
  }
  return value;
}

export const firebaseConfig = {
  apiKey: requiredEnv("FIREBASE_API_KEY"),
  authDomain:
    process.env.FIREBASE_AUTH_DOMAIN ??
    process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ??
    "nationalcreeradviceapp.firebaseapp.com",
  projectId:
    process.env.FIREBASE_PROJECT_ID ??
    process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ??
    "nationalcreeradviceapp",
  storageBucket:
    process.env.FIREBASE_STORAGE_BUCKET ??
    process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ??
    "nationalcreeradviceapp.firebasestorage.app",
  messagingSenderId:
    process.env.FIREBASE_MESSAGING_SENDER_ID ??
    process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ??
    "1059931069454",
  appId:
    process.env.FIREBASE_APP_ID ??
    process.env.EXPO_PUBLIC_FIREBASE_APP_ID ??
    "1:1059931069454:web:fbd7688ef75d973af8f05f",
  measurementId:
    process.env.FIREBASE_MEASUREMENT_ID ??
    process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID ??
    "G-LJ93RX72M7",
};

export function getFirebaseApp(): FirebaseApp {
  return getApps().length ? getApps()[0]! : initializeApp(firebaseConfig);
}

export function getDb(): Firestore {
  return getFirestore(getFirebaseApp());
}

export function getFirebaseAuth(): Auth {
  return getAuth(getFirebaseApp());
}
