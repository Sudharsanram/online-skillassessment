import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration - now using environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// --- App ID and Admin ---
// If 'appId' is meant to be a separate constant, ensure it's distinct from firebaseConfig.appId
// And use an environment variable for ADMIN_EMAIL as well for consistency and best practice.
export const appId = import.meta.env.VITE_APP_ID || 'skill-assessment-system'; // Assuming you might have a VITE_APP_ID in env too
export const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL; // Read admin email from environment variables

// --- Initialize Firebase ---
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);