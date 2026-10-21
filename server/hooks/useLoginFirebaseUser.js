import { getAuth , createUserWithEmailAndPassword, signInWithEmailAndPassword  } from '@firebase/auth';
import { getFirestore , getDoc, setDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db,auth } from '../firebase.js';

export const useLoginFirebaseUser = async (email,password) => 
{
  await signInWithEmailAndPassword(auth, email, password);
  const UserRef = doc(db, 'Users', auth.currentUser.uid);
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
  }
};