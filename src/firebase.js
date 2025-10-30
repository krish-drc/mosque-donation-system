// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";    
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyALrlO7xg75qtxUF4JH3zQKQPl6fzMuCmI",
  authDomain: "mosque-donation-system.firebaseapp.com",
  projectId: "mosque-donation-system",
  storageBucket: "mosque-donation-system.appspot.com",
  messagingSenderId: "671235070233",
  appId: "1:671235070233:web:7d70b1ec388463a6e60d88"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
