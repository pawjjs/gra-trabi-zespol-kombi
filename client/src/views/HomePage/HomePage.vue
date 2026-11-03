<script setup>
import { onMounted, watchEffect, ref, watch } from 'vue';
import { storeToRefs } from "pinia";
import { useRouter } from 'vue-router';
import { doc, getDoc } from 'firebase/firestore';

import { useApiRequest } from '../../hooks/useRequest.js';
import { useFirebase } from '../../store/firebase.js';

const firebase = useFirebase();
const router = useRouter();
const { user } = storeToRefs(firebase); // -> refs     -> user.value
                                        // -> firebase -> db
const userDetails = ref(null);
const fetchUserData = async () => 
{
    if(!firebase.isAuthenticated){
        return;
    }
    const docRef = doc(firebase.db, "Users", user.value.uid);
    const docSnap = await getDoc(docRef);
    if(docSnap.exists())
    {
        userDetails.value = docSnap.data();
    }
};

watchEffect(async () => {
    if(!firebase.isAuthenticated){
        router.push('/login');
    }    

    //console.log('tick');
})


onMounted(async () => {
    const jsonResponse = await useApiRequest('POST', '/api/firebase-claim-token', { x: 8 })
    .catch((er) => { console.log(er); })

    await fetchUserData();
});

/*watch(userDetails, () => {
    console.log(userDetails.value);
    //fetchUserData();
})*/



const handleLogOut = async () => {
    try{
        await firebase.logout();
    }
    catch(error){
        console.log(error);
    }
};
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