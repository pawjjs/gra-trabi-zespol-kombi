import { createUserWithEmailAndPassword } from '@firebase/auth';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db, auth} from '../firebase.js';

/**
 * @brief Registers a new user in Firebase Authentication and creates a corresponding document in Firestore.
 * @param {*} name The user's name.
 * @param {*} email The user's email.
 * @param {*} password The user's password.
 */
export const useRegisterFirebaseUser = async (name,email,password) => 
{
    await createUserWithEmailAndPassword(auth, email, password);
    const user = auth.currentUser;
    if (user) 
    {
      await setDoc(doc(db, 'Users', user.uid),
      {
        email: user.email,
        playerNick: name,
        //avatar: file_id,
        online: true,
        assigned: '',
        ping: serverTimestamp()
      });
    }
    else
    {
      throw 'Cannot find current user!';
    }
};