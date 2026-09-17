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

export const firebaseConfig = {
  apiKey: "AIzaSyDGdu31-s3g5B8DLVr87dBFxzderO8uo70",
  authDomain: "nationalcreeradviceapp.firebaseapp.com",
  projectId: "nationalcreeradviceapp",
  storageBucket: "nationalcreeradviceapp.firebasestorage.app",
  messagingSenderId: "1059931069454",
  appId: "1:1059931069454:web:fbd7688ef75d973af8f05f",
  measurementId: "G-LJ93RX72M7",
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
