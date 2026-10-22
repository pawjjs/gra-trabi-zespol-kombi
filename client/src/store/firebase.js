import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { useAuth } from '@vueuse/firebase/useAuth'
import { signInWithEmailAndPassword  } from '@firebase/auth';
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { defineStore } from "pinia";
import { toast } from 'vue3-toastify';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

export const useFirebase = defineStore('firebase', () => 
{
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_API_KEY,
    authDomain: import.meta.env.VITE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_APP_ID,
    measurementId: import.meta.env.VITE_MEASUREMENT_ID
  };
  const firebaseApp = initializeApp(firebaseConfig);
  const auth = getAuth(firebaseApp);
  const db = getFirestore(firebaseApp);

  const { isAuthenticated, user } = useAuth(auth);

  const login = async (email, password) => 
  {
    return signInWithEmailAndPassword(auth, email, password)
      .then(async () => 
      {
        /*const UserRef = doc(db, 'Users', auth.currentUser.uid);
        console.log('zalowowano na: ' + auth.currentUser.uid);
        const UserSnap = await getDoc(UserRef);
        if (UserSnap.exists()) 
        {
          await updateDoc(UserRef, {
            online: true
          })
        }
        else
        {
          throw `User snapshot doesn't exist`;
        }*/
        return true;
      })
      .catch((error) => 
      {
        toast(error.message,
        {
          autoClose: 1500,
          type: 'warning',
          theme: "dark",
          position: "bottom-center", 
          transition: "slide"
        }); 
        return false;
      })
  }
  //const register = async (...) => 
  //{
    // TODO: https://firebase.google.com/docs/auth/web/password-auth#create_a_password-based_account
  //}
  return { firebaseConfig, firebaseApp, auth, db, login , isAuthenticated , user }
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