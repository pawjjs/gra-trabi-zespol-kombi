<script setup>
import { computed, 
    onMounted,
    onUnmounted, 
    ref ,
    useTemplateRef, 
    watchEffect}                                                from 'vue';
import { usePointerLock }                                       from '@vueuse/core';
import * as THREE                                               from 'three';
import { TresCanvas, useLoader }                                from '@tresjs/core';
import { EffectComposer, UnrealBloom }                          from '@tresjs/post-processing';
import { useGLTF, GLTFModel , useAnimations , Stats}            from '@tresjs/cientos';
import { doc, getDoc } from 'firebase/firestore';

import { useFirebase } from '../../store/firebase.js';
import { storeToRefs } from "pinia";
import { useRouter } from 'vue-router';

import Player from '../Player.vue';
import Model from '../Model.vue';
//-----------------------------------------------------------------------------------------------
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
    await fetchUserData();
    socket = new WebSocket("ws://localhost:3000");//wss.on("connection")
    socket.on('open', () => {
        console.log('Connected to the WebSocket server');
    });
    if (socket?.readyState === WebSocket.OPEN) 
    {
      socket.send(userDetails.value.playerNick);
    }
});
onUnmounted(() => socket?.close());



const canvasContainer = useTemplateRef("canvas_container");
const canvas = computed(() => {
    return canvasContainer.value?.firstElementChild;
});
const mouseHover = ref(0);
const {
  isSupported,
  lock,
  unlock,
  element,
  triggerElement
} = usePointerLock(canvas);
const GROUND_SIZE = 450;
</script>

<template>
    <div class="canvas-window" ref="canvas_container"
    @mouseleave="() => {mouseHover = 0;}"
    @mousemove="() => {mouseHover = 1;}"
    >
        <TresCanvas clear-color="black" @mousedown.capture="lock">
            <Stats class="fps-counter"/>

            <TresAmbientLight :intensity="1" cast-shadow />

            <TresDirectionalLight :position="[5, 8, 5]" :intensity="2.5" />

            <TresDirectionalLight :position="[0, 2, 0]" :intensity="10.2" cast-shadow :color="'teal'"/>

            <GLTFModel 
                path="/glbModels/City2/KosowLacki.glb" 
                :position="[0,-23,0]"
                :scale="[3,3,3]"
                :rotation="[-Math.PI/2,0,0]"/>

            <Player path="/glbModels/2b_low_poly.glb"
                :hover="mouseHover"
                :playerLabel="firebase.user ? userDetails?.playerNick : 'Not logged in'"
                :limit="GROUND_SIZE / 2 - 1"/>


        </TresCanvas>
    </div>
</template>

<style lang="css" scoped>
h1{
    color: yellow;
}

.canvas-window{
    width: 99.4%;
    height: 98%;
    padding: 0.3vw;
}

.fps-counter{
    position: absolute;
    top: 1;
    left: 50%;
}
</style>