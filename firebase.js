import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: "livedoc-2d8ea.firebaseapp.com",
  projectId: "livedoc-2d8ea",
  storageBucket: "livedoc-2d8ea.appspot.com",
  messagingSenderId: "832739324391",
  appId: process.env.APP_ID,
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export default db;
