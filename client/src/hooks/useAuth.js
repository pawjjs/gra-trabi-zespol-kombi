import { onAuthStateChanged , getAuth} from 'firebase/auth';
import { inject , provide , ref, onUnmounted } from 'vue';
import { useFirebase } from '../store/firebase';


const AuthKey = Symbol('auth');

export function provideAuth() 
{
    const user = ref(null);
    const loading = ref(true);

        const firebase = useFirebase();
    const auth = firebase.auth;
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        user.value = currentUser
        loading.value = false
    });
    onUnmounted(unsubscribe);
    provide(AuthKey, { user, loading });
}


export async function useAuth() 
{
    const context = inject(AuthKey)
    if (!context) {
        throw new Error('useAuth() musi być użyte wewnątrz komponentu, który wywołuje provideAuth()')
    }
    return context
}