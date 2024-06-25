// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCkb6dSPNV97yVEUKgjOnSVUs8v8yZp1po",
  authDomain: "flutterflow-test-2a1ab.firebaseapp.com",
  projectId: "flutterflow-test-2a1ab",
  storageBucket: "flutterflow-test-2a1ab.appspot.com",
  messagingSenderId: "533330931608",
  appId: "1:533330931608:web:da69374fccb7cfcb5485ed",
  measurementId: "G-PFGHXZMQHC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore(app);

export {db};