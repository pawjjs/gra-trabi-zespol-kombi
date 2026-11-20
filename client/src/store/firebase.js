import { initializeApp }                                     from "firebase/app";
import { getAuth, signInWithEmailAndPassword }               from "firebase/auth";
import { useAuth }                                           from '@vueuse/firebase/useAuth'
import { getFirestore , getDoc, doc, updateDoc , Timestamp } from "firebase/firestore";
import { defineStore }                                       from "pinia";
import { nextTick, ref , watch}                              from "vue";
import { useStorage }                                        from '@vueuse/core'
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

  const userID = useStorage('userID',undefined);
  const userSnapshot = useStorage('userSnapshot',undefined,undefined,
    {
       serializer: {
          read: (v) => v ? JSON.parse(v):undefined,
          write:(v) => JSON.stringify(v)
       }
    }
  );
  watch(userSnapshot, async (to, from) => 
  {
    console.log(to?.online); //user with updated param
    console.log(from);//undefined
    if (!from || !to)
    {
      return;
    }
    const userRef = doc(db, 'Users', userID.value);
    await updateDoc(userRef, to);
},
{ deep: true });

  const { isAuthenticated, user } = useAuth(auth);
  const isAuthReady = ref(false);
  
  const login = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password)
      .then(async () => {
        const UserRef = doc(db, 'Users', auth.currentUser.uid);
        const UserSnap = await getDoc(UserRef);
        if (UserSnap.exists()) 
        {
          userID.value = auth.currentUser.uid;
          userSnapshot.value = UserSnap.data();
          userSnapshot.value.online = true;
          userSnapshot.value.ping = Timestamp.fromDate(new Date());
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
    if (userSnapshot.value) 
    {
      userSnapshot.value.online = false;
      userSnapshot.value.ping = Timestamp.fromDate(new Date());
      await nextTick();     //ping = null ??????
      userSnapshot.value = undefined;
      userID.value = undefined;
    }
    await auth.signOut();
  };

  auth.authStateReady()
  .then(() => {
    isAuthReady.value = true;
  })



  return { 
    //<Objects>:
    firebaseConfig, 
    firebaseApp, 
    auth, 
    db, 
    isAuthenticated, 
    user,
    isAuthReady,
    userSnapshot,
    
    //<Functions>:
    login,
    logout
    //fetchUserData
  }
});