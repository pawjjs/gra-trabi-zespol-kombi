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


watchEffect(async () => {
    //if(!firebase.isAuthenticated)
    //{
    //    router.push('/login');
    //}
    //const jsonResponse = await useApiRequest('POST', '/api/firebase-auth', { x: 8 })
    //.catch(() => { /* toast przy błędzie */ }) 
    //console.log(jsonResponse);
})

onMounted(async () => {
    //if(!firebase.isAuthenticated)
    //{
    //    router.push('/login');
    //}

    const jsonResponse = await useApiRequest('POST', '/api/firebase-auth', { x: 8 })
    .catch(() => { /* toast przy błędzie */ }) 
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