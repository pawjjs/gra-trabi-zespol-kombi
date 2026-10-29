<script setup>
import { onMounted, watchEffect } from 'vue';
import { useRouter } from 'vue-router';

import { useApiRequest } from '../../hooks/useRequest.js';
import { useFirebase } from '../../store/firebase.js';

const firebase = useFirebase();
const router = useRouter();

const handleLogOut = async () => {
    try{
        await firebase.logout();
    }
    catch(error){
        console.log(error);
    }
};

//if not auth -> get back to '/'
watchEffect(async () => {
    if(!firebase.isAuthenticated)
    {
        router.push('/login');
    }
})


onMounted(async () => {
    const jsonResponse = await useApiRequest('POST', '/api/firebase-claim-token', { x: 8 })
    .catch((er) => { console.log(er); }) 
    console.log(jsonResponse);
});
</script>

<template>
    <div v-if="!firebase.isAuthenticated">
        Loading...
    </div>
    <div v-else>
        {{ firebase.user ? `Logged in as ${firebase.user.email}` : 'Not logged in' }}
        <hr/>
        <p>{{ firebase.isAuthenticated }}</p>
        <hr/>
        <button @click="handleLogOut">
            Logout 
        </button>
    </div>
</template>