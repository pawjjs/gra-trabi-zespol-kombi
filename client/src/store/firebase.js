import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useAuth } from '@vueuse/firebase/useAuth'
import { getFirestore , getDoc, doc, updateDoc } from "firebase/firestore";
import { defineStore } from "pinia";
import { toast } from 'vue3-toastify';
import { ref , watch} from "vue";
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
  const userSnapshot = ref();// JS-12-11-2026
  const { isAuthenticated, user } = useAuth(auth);//Client side auth-Hook
  const isAuthReady = ref(false);
  
  const login = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password)
      .then(async () => {
        const UserRef = doc(db, 'Users', auth.currentUser.uid);
        const UserSnap = await getDoc(UserRef);
        if (UserSnap.exists()) {
          await updateDoc(UserRef, {
            online: true
          });
          userSnapshot.value = UserSnap.data()// JS-12-11-2026
        }
        else{
          throw `User snapshot doesn't exist`;  
        }
        return true;
      })
      .catch((error) => {
        throw new Error(error);
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
    await auth.signOut();//NET::ERR_BLOCKED_BY_CLIENT turn off Brave Shield
  };

  auth.authStateReady()
  .then(() => {
    isAuthReady.value = true;
  })

  watch(userSnapshot, async (to, from) => {// JS-12-11-2026
    if (!from || !to) return // ignorujemy jezeli wczesniej byl null, lub jezeli teraz jest null// JS-12-11-2026
    await updateDoc(UserRef, to)// JS-12-11-2026
  })// JS-12-11-2026
  


  return { 
    //<Objects>:
    firebaseConfig, 
    firebaseApp, 
    auth, 
    db, 
    isAuthenticated, 
    user,
    isAuthReady,
    userSnapshot,// JS-12-11-2026
    
    //<Functions>:
    login,
    logout
    //fetchUserData
  }
});