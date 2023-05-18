// Import the functions you need from the SDKs you need
import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCVIH2EfkofT5hH5MIvvWmn0BDRhNgEqk4",
  authDomain: "modal-fc6f2.firebaseapp.com",
  projectId: "modal-fc6f2",
  storageBucket: "modal-fc6f2.appspot.com",
  messagingSenderId: "903264762917",
  appId: "1:903264762917:web:b29d5be7f171187f5a93cc",
};

// Initialize Firebase
const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
