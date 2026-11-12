<script setup>
import { onMounted, watchEffect, ref} from 'vue';
import { storeToRefs } from "pinia";
import { useRouter } from 'vue-router';
import { doc, getDoc } from 'firebase/firestore';

import { useApiRequest } from '../../hooks/useRequest.js';
import { useFirebase } from '../../store/firebase.js';
import Nexus from '../Nexus/Nexus.vue';

const firebase = useFirebase();
const router = useRouter();
const { user, userSnapshot } = storeToRefs(firebase);

/*const userDetails = ref(null);
const fetchUserData = async () => 
{
    const docRef = doc(firebase.db, "Users", user.value.uid);
    const docSnap = await getDoc(docRef);
    if(docSnap.exists()){
        userDetails.value = docSnap.data();
        console.log(userDetails.value.playerNick);//RyanGosling123 HomePage.vue:22 
    }
};*/

watchEffect(async () => {
    if(!firebase.isAuthenticated){
        router.push('/login');
    }    
})

onMounted(async () => {
    const jsonResponse = await useApiRequest('POST', '/api/firebase-claim-token', { x: 8 })
    .catch((er) => { console.log(er); })

    console.log(userSnapshot);
});

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
    <div class="menu" v-else>
        <h1 class="user-name">
            {{ firebase.user ? userSnapshot.playerNick : 'Not logged in' }}
            <!--{{ 
                firebase.user ? userDetails.playerNick : 'Not logged in'
            }}-->
            <!--
                HomePage.vue:54 Uncaught (in promise) TypeError: Cannot read properties of null (reading 'playerNick') at Proxy._sfc_render (HomePage.vue:54:44)
            -->
        </h1>

        <p>{{ firebase.user ? `Logged in as ${firebase.user.email}` : 'Not logged in' }}</p>
        <p>{{ firebase.isAuthenticated }}</p>
        <Nexus />
        <button @click="handleLogOut">
            Logout 
        </button>
    </div>
</template>

<style lang="css" scoped>
.menu{
    padding: 0.1vw;
    background-color: rgb(15, 0, 46);
    display: flex;
    flex-direction: column;
    align-items: center;

    overflow-y: scroll;
}
.menu p{
    color: wheat;
    font-size: 2vw;
}
.user-name{
    color: wheat;
}

button {
  margin-top: 0.2vw;
  padding: 0.44vw;
  font-size: 1vw;
  font-weight: 700;
  color: #000;
  background: #ffeb00;
  border: 0.2vw solid #000;
  border-radius: 1vw;

  cursor: pointer;
}
button:hover {
  background: #fff35c;
}
</style>