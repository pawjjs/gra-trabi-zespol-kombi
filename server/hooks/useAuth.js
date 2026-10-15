import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase.js';

export const useAuth = () => {
    return({
        user:"yes",
        loading: false
    });
}