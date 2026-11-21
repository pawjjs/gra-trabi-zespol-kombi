<script setup>
import { 
    onMounted,onUnmounted, 
    ref, computed , 
    watch,watchEffect,
    useTemplateRef, 
    shallowRef}                                                 from 'vue';
import { usePointerLock }                                       from '@vueuse/core';
import * as THREE                                               from 'three';
import { TresCanvas, useLoader }                                from '@tresjs/core';
import { EffectComposer, UnrealBloom }                          from '@tresjs/post-processing';
import { useGLTF, GLTFModel , useAnimations , Stats,StatsGl,OrbitControls}    from '@tresjs/cientos';

import { io } from "socket.io-client";
import { useFirebase } from '../../store/firebase.js';
import { doc, getDoc } from 'firebase/firestore';
import { storeToRefs } from "pinia";
import { useRouter } from 'vue-router';

import Player from '../Player.vue';
import Model from '../Model.vue';
import StaticModel from '../../components/Tres3D/StaticModel.vue';
//-----------------------------------------------------------------------------------------------
const firebase = useFirebase();

const router = useRouter();
watchEffect(async () => {
    if(!firebase.isAuthenticated){
        router.push('/login');
    }    
})

const { user } = storeToRefs(firebase);
const userDetails = ref(null);
const fetchUserData = async () => 
{
    const docRef = doc(firebase.db, "Users", user.value.uid);
    const docSnap = await getDoc(docRef);
    if(docSnap.exists())
    {
        userDetails.value = docSnap.data();
    }
};

const players = shallowRef([]);
const xd = ref(false);

const socket = io("http://localhost:3000", {
    auth: { userID: user.value.uid },
  //auth: { token: "twoj-token" },
  //autoConnect: true,
});


onMounted(async () => {
    await fetchUserData();
    socket.emit('enter world', userDetails.value.playerNick);

    socket.on('entered world', (msg) => {
        players.value.push(msg);
        console.log(players.value);
        if(players.value.length == 2){
            xd.value = true;
        }
    });
});

//onUnmounted(() => socket?.close());




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
//https://terraprinter.com/#lat=52.59115&lon=22.14536&z=16.08&p=35&b=-7&tool=pan&tm=single&mr=2&mc=2&bm=esri&sa=315&sl=45&hx=1&flt=0&tc=5b8a3a&d=1&sz=200&ve=1.1&bs=5&slm=0&rs=60&sm=0&st=1&sh=1&ec=1&sd=elevation&bth=0&pvb=1&pb=0&ts=realistic&mcb=4&mcn=120&mcs=0.08&mco=0.68&mcw=0.88&pzp=25&pzg=0.24&pze=classic&pzl=grid&tre=0&lmk=1&trs=20&trh=8&frm=0&frw=8&frh=3&lbl=0&lbc=1&con=0&coi=50&coh=0.7&losm=012345&pl=012345&fc=ffffff%2C5cb3e8%2C7bb867%2C6b6f76%2C8a6342%2C2c2c2c&fe2=1.0%2C1.0%2C1.0%2C1.0%2C1.0%2C1.0&fw2=1.0%2C1.0%2C1.0&surf=0&scc=f5f9ff%2Ccfe6f2%2C2f6b34%2C7bb867%2C8c8378%2Ce7d9a8%2C5cb3e8&sce=1111110&scsrc=lc&scn=6&scrs=1&scrd=38&scmp=2.5&scmx=4&sel=rect%3A22.13526%2C52.59661%2C22.15388%2C52.58975

//const { onBeforeRender } = useLoop();

//onBeforeRender(({ delta,elapsed }) => {

//});

</script>

<template>
    <div class="canvas-window" ref="canvas_container"
    @mouseleave="() => {mouseHover = 0;}"
    @mousemove="() => {mouseHover = 1;}"
    >
        <TresCanvas clear-color="black" @mousedown.capture="">
            <StatsGl />
            <OrbitControls/>
            
            <TresAmbientLight :intensity="1" cast-shadow />

            <TresDirectionalLight :position="[5, 8, 5]" :intensity="2.5" />

            <TresDirectionalLight :position="[0, 2, 0]" :intensity="10.2" cast-shadow :color="'teal'"/>

            <GLTFModel 
                path="/glbModels/City2/KosowLacki.glb" 
                :position="[0,-25,0]"
                :scale="[4,4,4]"
                :rotation="[-Math.PI/2,0,0]"/>

            <StaticModel v-if="xd" :path="'/glbModels/Morgana/scene.gltf'" :position="[4,20,3]"  cast-shadow/>

           
 


        </TresCanvas>
    </div>
</template>

<style lang="css" scoped>
/**
<Player path="/glbModels/2b_low_poly.glb"
                :hover="mouseHover"
                :playerLabel="firebase.user ? userDetails?.playerNick : 'Not logged in'"
                :limit="GROUND_SIZE / 2 - 1"/>
 */

h1{
    color: yellow;
}
.canvas-window{
    width: 99.4%;
    height: 98%;
    padding: 0.3vw;
}

</style>