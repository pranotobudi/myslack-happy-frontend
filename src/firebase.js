import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; 

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAb2AySVZmhfo4XYwOwK1Qm02KH-AxL9fE",
  authDomain: "myslack-happy.firebaseapp.com",
  projectId: "myslack-happy",
  storageBucket: "myslack-happy.appspot.com",
  messagingSenderId: "108700134153",
  appId: "1:108700134153:web:0564a8af6c9f23a79581d8"
};
  
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const auth = getAuth();
const provider = new GoogleAuthProvider();
// const signInWithPopup = signInWithPopup;
export { db, firebaseConfig, auth, provider, signInWithPopup }