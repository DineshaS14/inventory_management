// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore'; // needed to import Firebase after creating firebase Database

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDloOfw7xwdwLqMZecc4-MS_iOGMmpHLqM",
  authDomain: "inventory-management-25242.firebaseapp.com",
  projectId: "inventory-management-25242",
  storageBucket: "inventory-management-25242.appspot.com",
  messagingSenderId: "1060189261320",
  appId: "1:1060189261320:web:35241ff935b35870eecbbd",
  measurementId: "G-WRKX1GGJ8P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export{firestore} // because we want to access firebase for its file