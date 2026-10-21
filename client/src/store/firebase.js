import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

import { defineStore } from "pinia";
import { shallowRef } from "vue";

export const useFirebase = defineStore('firebase', () => 
{
  const firebaseConfig = {
    apiKey: "AIzaSyDs_1rS1W2HmFKWT8GloPnETCuMGyjcRQM",
    authDomain: "nierjs.firebaseapp.com",
    projectId: "nierjs",
    storageBucket: "nierjs.firebasestorage.app",
    messagingSenderId: "712168672064",
    appId: "1:712168672064:web:6b5c5bff864648b11dc8a5",
    measurementId: "G-V86HYHMNCC"
  };
  const firebaseApp = shallowRef(null);
  const auth = shallowRef(null);
  const db = shallowRef(null);

  function init() 
  {
    if (firebaseApp.value) 
    {
      return ;
    }
    // Initialize Firebase
    firebaseApp.value = initializeApp(firebaseConfig);
    auth.value = getAuth(firebaseApp.value)
    db.value = getFirestore(firebaseApp.value)
  }

  return { firebaseConfig, firebaseApp, auth, db, init }
});



/*export const firebaseConfig = {
  apiKey: "AIzaSyDs_1rS1W2HmFKWT8GloPnETCuMGyjcRQM",
  authDomain: "nierjs.firebaseapp.com",
  projectId: "nierjs",
  storageBucket: "nierjs.firebasestorage.app",
  messagingSenderId: "712168672064",
  appId: "1:712168672064:web:6b5c5bff864648b11dc8a5",
  measurementId: "G-V86HYHMNCC"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db   = getFirestore(firebaseApp);

export default firebaseApp;*/