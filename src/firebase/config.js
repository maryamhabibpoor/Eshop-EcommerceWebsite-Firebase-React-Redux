import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyAFAT3nGDmd6H1rcpApekuRnxMEDzjopyU",
  authDomain: "eshop-65021.firebaseapp.com",
  projectId: "eshop-65021",
  storageBucket: "eshop-65021.appspot.com",
  messagingSenderId: "1061423943199",
  appId: "1:1061423943199:web:a78f64b09508b9bc030f2a"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
