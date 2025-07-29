/* global __app_id */
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBGL8qTVHJ4rwCZRk1eIlTqLoKK0vwUE6w",
  authDomain: "online-skill-assessment-system.firebaseapp.com",
  projectId: "online-skill-assessment-system",
  storageBucket: "online-skill-assessment-system.firebasestorage.app",
  messagingSenderId: "230648953456",
  appId: "1:230648953456:web:89d60dac30c8f01f3b12b5",
  measurementId: "G-C9F6RCV29Z"
};


// --- App ID and Admin ---
export const appId = typeof __app_id !== 'undefined' ? __app_id : 'skill-assessment-system';
export const ADMIN_EMAIL = 'admin@skill.test';

// --- Initialize Firebase ---
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);