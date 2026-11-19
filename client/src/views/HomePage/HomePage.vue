<script setup>
import { onMounted, watchEffect, ref} from 'vue';
import { storeToRefs } from "pinia";
import { useRouter } from 'vue-router';
import { doc, getDoc } from 'firebase/firestore';

import { useApiRequest } from '../../hooks/useRequest.js';
import { useFirebase } from '../../store/firebase.js';
import Nexus from '../Nexus/Nexus.vue';

const firebase = useFirebase();
const { user } = storeToRefs(firebase);

const userDetails = ref(null);
const fetchUserData = async () => 
{
    const docRef = doc(firebase.db, "Users", user.value.uid);
    const docSnap = await getDoc(docRef);
    if(docSnap.exists())
    {
        userDetails.value = docSnap.data();
        console.log(userDetails.value.playerNick);
    }
};

const router = useRouter();
watchEffect(async () => {
    if(!firebase.isAuthenticated){
        router.push('/login');
    }    
})

onMounted(async () => {
    const jsonResponse = await useApiRequest('POST', '/api/firebase-claim-token', { x: 8 })
    .catch((er) => { console.log(er); })

    await fetchUserData();

});

const handleLogOut = async () => {
    try{
        await firebase.logout();
    }
    catch(error){
        console.log(error);
    }
};

const handlePlay = () => {
    router.push('/game');
}

</script>

<template>
    <div v-if="!firebase.isAuthenticated">
        Loading...
    </div>
    <div class="menu" v-else>
        <div class="top">
            <h1 class="user-name">
                {{ firebase.user ? userDetails?.playerNick : 'Not logged in' }}
            </h1>
            <div class="avatar-img">
                <!--Avater Here-->
            </div>
            <div class="buttons-table">
                <button @click="">
                    {{ 2+2==3 ? 'Select Character' : 'Create Character' }}
                </button>
                <button @click="">
                    Account Settings
                </button>
                <button @click="handleLogOut">
                    Logout 
                </button>
            </div>
        </div>
        <div class="mid" :disabled="true" @click="handlePlay">
            <button class="enter-the-world">
                PLAY
            </button>
        </div>

        <Nexus />
    </div>
</template>

<style lang="css" scoped>
@import url('https://fonts.googleapis.com/css2?family=Asimovian&family=Chewy&family=IBM+Plex+Serif:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&family=Tektur:wght@400..900&display=swap');

.menu{
    padding: 0.1vw;
    background-color: rgb(238, 238, 238);
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: auto;
    max-height: 25vw;
    border: 0.7vw ridge #c4b300;
    box-shadow: #00000063 1vw 1vw 1vw;
}
.top{
    display: flex;
    justify-content: space-between;
    gap: 2vw;
    align-items: center;
    margin: 1vw;
}
.avatar-img{
    width: 8vw;
    height: 8vw;
    background-color: aqua;
    box-shadow: #000 0.1vw 0.1vw 0.5vw;
    border-top: #c4b300 solid 0.3vw;
    border-left: #c4b300 solid 0.3vw;
    flex: 1;
}
.user-name{
    font-family: "Tektur", sans-serif;
    font-optical-sizing: auto;
    font-style: normal;
    color: rgb(196, 166, 0);
    font-size: 1.6vw;
    text-shadow: #000 0.1vw 0.1vw;
}
.buttons-table{
    display: flex;
    flex-direction: column;
    align-items: baseline;
    flex: 1;
}

.mid{
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

button {
  margin-top: 0.2vw;
  padding: 0.44vw;
  font-size:0.71vw;
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
.enter-the-world{
    width: 90%;
    border-radius: 0.1vw;
    background: #ffeb00;
    border: 0.3vw ridge #000;
    box-shadow: #000 0.1vw 0.1vw 0.5vw;
    color: rgb(0, 0, 0);
}

.enter-the-world:disabled {
    width: 90%;
    border-radius: 0.1vw;
    background: #bfbfbf;
    border: 0.3vw ridge #777;
    box-shadow: #888 0.1vw 0.1vw 0.5vw;
    color: #666;
    cursor: not-allowed;
    opacity: 0.6;
}
</style>