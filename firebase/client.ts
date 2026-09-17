import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAuth, type Auth } from "firebase/auth";

export const firebaseConfig = {
  apiKey: "AIzaSyDGdu31-s3g5B8DLVr87dBFxzderO8uo70",
  authDomain: "nationalcreeradviceapp.firebaseapp.com",
  projectId: "nationalcreeradviceapp",
  storageBucket: "nationalcreeradviceapp.firebasestorage.app",
  messagingSenderId: "1059931069454",
  appId: "1:1059931069454:web:fbd7688ef75d973af8f05f",
  measurementId: "G-LJ93RX72M7",
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
