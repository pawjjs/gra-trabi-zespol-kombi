<script setup>
import { onAuthStateChanged } from 'firebase/auth';
import { inject,provide } from 'vue';
import { useFirebase } from '../store/firebase';

const AuthContext = Symbol('authContext');//Provider , Context - passing data evading deep argument giving

export function provideAuth() 
{
    const user = ref(null);
    const loading = ref(true);
    const firebase = useFirebase();
    const auth = firebase.auth;

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        user.value = currentUser;
        loading.value = false;
    });
    onUnmounted(unsubscribe);
    provide(AuthContext, { user, loading });// createContext({user,loading})
}

export function useAuth() 
{
    const context = inject(AuthContext); //useContext(auth)
    return context
}
</script>