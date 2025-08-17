// Import Firebase services
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase config from earlier
const firebaseConfig = {
  apiKey: "AIzaSyADDJ1Cjl5xsCJ8tTPg_78c0pfMwWpm1iQ",
  authDomain: "tos-trap-detector.firebaseapp.com",
  projectId: "tos-trap-detector",
  storageBucket: "tos-trap-detector.firebasestorage.app",
  messagingSenderId: "902369395326",
  appId: "1:902369395326:web:fa759ee6754813a34a8e2f",
  measurementId: "G-ZKL3TPSH16"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Export these so you can use them elsewhere
export { auth, db };
