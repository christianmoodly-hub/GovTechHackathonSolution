import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import {
  initializeAuth,
  getAuth,
  type Auth,
  // @ts-expect-error React Native persistence export exists at runtime in firebase/auth
  getReactNativePersistence,
} from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing ${name}. Copy mobile/.env.example to mobile/.env and fill in values. Never commit API keys.`
    );
  }
  return value;
}

export const firebaseConfig = {
  apiKey: requiredEnv("EXPO_PUBLIC_FIREBASE_API_KEY"),
  authDomain:
    process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ??
    "nationalcreeradviceapp.firebaseapp.com",
  projectId:
    process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? "nationalcreeradviceapp",
  storageBucket:
    process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ??
    "nationalcreeradviceapp.firebasestorage.app",
  messagingSenderId:
    process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "1059931069454",
  appId:
    process.env.EXPO_PUBLIC_FIREBASE_APP_ID ??
    "1:1059931069454:web:fbd7688ef75d973af8f05f",
  measurementId:
    process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID ?? "G-LJ93RX72M7",
};

let authInstance: Auth | null = null;

export function getFirebaseApp(): FirebaseApp {
  return getApps().length ? getApps()[0]! : initializeApp(firebaseConfig);
}

export function getFirebaseAuth(): Auth {
  if (authInstance) return authInstance;

  const app = getFirebaseApp();
  try {
    authInstance = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch {
    // Auth already initialized (Fast Refresh / hot reload)
    authInstance = getAuth(app);
  }
  return authInstance;
}

export function getDb(): Firestore {
  return getFirestore(getFirebaseApp());
}
