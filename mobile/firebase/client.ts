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
import { publicEnv } from "../utils/publicEnv";

function readEnv(name: string): string | undefined {
  return publicEnv(name);
}

function requiredEnv(name: string): string {
  const value = readEnv(name);
  if (!value) {
    throw new Error(
      `Missing ${name}. For EAS builds, set this in the Expo project Environment (preview/production). Locally, copy mobile/.env.example to mobile/.env.`,
    );
  }
  return value;
}

function buildFirebaseConfig() {
  return {
    apiKey: requiredEnv("EXPO_PUBLIC_FIREBASE_API_KEY"),
    authDomain:
      readEnv("EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN") ??
      "nationalcreeradviceapp.firebaseapp.com",
    projectId:
      readEnv("EXPO_PUBLIC_FIREBASE_PROJECT_ID") ?? "nationalcreeradviceapp",
    storageBucket:
      readEnv("EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET") ??
      "nationalcreeradviceapp.firebasestorage.app",
    messagingSenderId:
      readEnv("EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID") ?? "1059931069454",
    appId:
      readEnv("EXPO_PUBLIC_FIREBASE_APP_ID") ??
      "1:1059931069454:web:fbd7688ef75d973af8f05f",
    measurementId:
      readEnv("EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID") ?? "G-LJ93RX72M7",
  };
}

let authInstance: Auth | null = null;
let cachedConfig: ReturnType<typeof buildFirebaseConfig> | null = null;

export function getFirebaseConfig() {
  if (!cachedConfig) cachedConfig = buildFirebaseConfig();
  return cachedConfig;
}

/** @deprecated Prefer getFirebaseConfig() — kept for call sites that imported this. */
export const firebaseConfig = new Proxy({} as ReturnType<typeof buildFirebaseConfig>, {
  get(_target, prop) {
    return getFirebaseConfig()[prop as keyof ReturnType<typeof buildFirebaseConfig>];
  },
});

export function getFirebaseApp(): FirebaseApp {
  return getApps().length ? getApps()[0]! : initializeApp(getFirebaseConfig());
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
