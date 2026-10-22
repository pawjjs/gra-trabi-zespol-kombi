<script setup>
//import { useAuth , provideAuth} from '../../hooks/useAuth.js';
import { onMounted } from 'vue';
import { useFirebase } from '../../store/firebase.js';

//const jsonResponse = await useApiRequest('POST', '/siema', { x: 8 })
//  .catch(() => { /* toast przy błędzie */ }) 

const firebase = useFirebase();
//provideAuth();

onMounted(async () => 
{
   // await firebase.login('ryangszdxcfdsfng@ether.lord','Qwesdfgvsad_77*');
  console.log(firebase.user); 
});
</script>

<template>
    <div v-if="!firebase.isAuthenticated">Loading...</div>
    <div v-else>
        {{ firebase.user ? `Logged in as ${firebase.user.email}` : 'Not logged in' }}
        <hr/>
        <button>
            Logout
        </button>
    </div>
</template>