import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import * as FirebaseAuth from "firebase/auth";

const buildFallbackConfig = {
  apiKey: "AIzaSyBuildOnlyFallbackKey000000000000000000",
  authDomain: "taskly-build.local",
  projectId: "taskly-build",
  storageBucket: "taskly-build.appspot.com",
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:0000000000000000000000",
  measurementId: "G-0000000000",
};

const firebaseConfig = {
  apiKey:
    process.env.EXPO_PUBLIC_FIREBASE_API_KEY || buildFallbackConfig.apiKey,
  authDomain:
    process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    buildFallbackConfig.authDomain,
  projectId:
    process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ||
    buildFallbackConfig.projectId,
  storageBucket:
    process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    buildFallbackConfig.storageBucket,
  messagingSenderId:
    process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ||
    buildFallbackConfig.messagingSenderId,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || buildFallbackConfig.appId,
  measurementId:
    process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID ||
    buildFallbackConfig.measurementId,
};

const app = initializeApp(firebaseConfig);

const getReactNativePersistence = (
  FirebaseAuth as typeof FirebaseAuth & {
    getReactNativePersistence?: (
      storage: typeof AsyncStorage,
    ) => FirebaseAuth.Persistence;
  }
).getReactNativePersistence;

export const auth = getReactNativePersistence
  ? FirebaseAuth.initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    })
  : FirebaseAuth.getAuth(app);
