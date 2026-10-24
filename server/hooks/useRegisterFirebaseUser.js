import { createUserWithEmailAndPassword } from '@firebase/auth';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';

import { db, auth} from '../firebase.js';

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