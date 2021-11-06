
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCsUSWpOA7PElfY4mkFxGAV8g4MYh7ALLo",
  authDomain: "react-app-ab9a3.firebaseapp.com",
  projectId: "react-app-ab9a3",
  storageBucket: "react-app-ab9a3.appspot.com",
  messagingSenderId: "448750039508",
  appId: "1:448750039508:web:ed9eb736bd6d9776abe641",
  measurementId: "G-HKKW23RBQ6",
};

//   apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
//   authDomain: process.env.REACT_APP_FIREBASE_API_KEY,
//   projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.REACT_APP_FIREBASE_APP_ID,
//   measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
