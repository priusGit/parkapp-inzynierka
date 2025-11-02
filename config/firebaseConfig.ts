import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDb9tkZ0Md_rD2W1jVTipxreRuEZJ7Gpuk",
  authDomain: "inzynierka-1d914.firebaseapp.com",
  projectId: "inzynierka-1d914",
  storageBucket: "inzynierka-1d914.firebasestorage.app",
  messagingSenderId: "826030158917",
  appId: "1:826030158917:web:d0b631c75820e9471b1f2c",
  measurementId: "G-V30W9PFVYM",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
