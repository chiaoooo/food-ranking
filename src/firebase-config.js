// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyARrgc_cUTV7ZazhLfaRQA7aOfn4Xlf2OA",
  authDomain: "food-ranking-e54e5.firebaseapp.com",
  projectId: "food-ranking-e54e5",
  storageBucket: "food-ranking-e54e5.appspot.com",
  messagingSenderId: "647035464678",
  appId: "1:647035464678:web:9d4cf2af7d8ef5ee0b8427",
  measurementId: "G-8TMZKLWDYV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const analytics = getAnalytics(app);

export { db };