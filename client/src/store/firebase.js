import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { useAuth } from '@vueuse/firebase/useAuth'
import { signInWithEmailAndPassword  } from '@firebase/auth';
import { getFirestore , getDoc, doc, updateDoc } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { defineStore } from "pinia";
import { toast } from 'vue3-toastify';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

export const useFirebase = defineStore('firebase', () => 
{
  /*state:() =>({
    score:0,
    health:100
  });
  
  getters:{
    getScore(){
      return this.score
    }
  }

  action:{
    methodNameXD(){
      this.score++;
    }
  
  }
  */

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

  const { isAuthenticated, user } = useAuth(auth);//Client side auth-Hook

  const login = async (email, password) => 
  {
    return signInWithEmailAndPassword(auth, email, password)
      .then(async () => 
      {
        const UserRef = doc(db, 'Users', auth.currentUser.uid);
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
        }
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

  const logout = async () => {
    const UserRef = doc(db, "Users", auth.currentUser.uid);
    const UserSnap = await getDoc(UserRef);
    if (UserSnap.exists()) 
    {
      await updateDoc(UserRef, {
        online: false
      })
    }
    await auth.signOut();//NET::ERR_BLOCKED_BY_CLIENT
  };

  //const register = async (...) => 
  //{
    // TODO: https://firebase.google.com/docs/auth/web/password-auth#create_a_password-based_account
  //}
  return { 
    //<Objects>:
    firebaseConfig, 
    firebaseApp, 
    auth, 
    db, 
    isAuthenticated, 
    user,
    
    //<Functions>:
    login,
    logout 
  }
});