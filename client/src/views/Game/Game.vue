<script setup>
import { 
    onMounted,onUnmounted, 
    ref, computed , 
    watch,watchEffect,
    useTemplateRef,
    shallowRef,}                                                from 'vue';
import { usePointerLock }                                       from '@vueuse/core';
import * as THREE                                               from 'three';
import { TresCanvas, useLoader }                                from '@tresjs/core';
import { EffectComposer, UnrealBloom }                          from '@tresjs/post-processing';
import { Html, GLTFModel , useAnimations , Stats,StatsGl,OrbitControls}    from '@tresjs/cientos';
import { useFirebase } from '../../store/firebase.js';
import { doc, getDoc } from 'firebase/firestore';
import { storeToRefs } from "pinia";
import { useRouter } from 'vue-router';
import { io } from "socket.io-client";

import Player from '../Player.vue';
import Model from '../Model.vue';
import StaticModel from '../../components/Tres3D/StaticModel.vue';
import CollisionShape3D from '../../components/Tres3D/CollisionShape3D.vue';
//-----------------------------------------------------------------------------------------------
const firebase = useFirebase();

const router = useRouter();
watchEffect(async () => {
    if(!firebase.isAuthenticated){
        router.push('/');
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

const players = ref({});
const socket = io("http://localhost:3000", {
    auth: { userID: user.value.uid },
  //auth: { token: "twoj-token" },
  //autoConnect: true,
});

socket.on('get players', (allPlayers)=>{
    players.value = allPlayers;
    console.log("Prev:");
    console.log(players.value);
});

socket.on('entered world', (player) => {
    if(!players.value[user.value.uid]){
        players.value[user.value.uid] = player;
        console.log("Hello " , players.value[user.value.uid].name);
        console.log("Actual:");
        console.log(players.value);
    }
});


onMounted(async () => {
    await fetchUserData();
    socket.emit('fetch players'); 
    socket.emit('enter world', userDetails.value.playerNick);
    
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


//<StaticModel :path="'/glbModels/Morgana/scene.gltf'" :position="[-104,20,3]"  cast-shadow/>
const skyColor = 0x6693A6;
const groundColor = 0xA0101;
</script>

<template>
    <div class="canvas-window" ref="canvas_container"
    @mouseleave="() => {mouseHover = 0;}"
    @mousemove="() => {mouseHover = 1;}"
    >
        <TresCanvas clear-color="#abfbff" @mousedown.capture="">
            <StatsGl />
            <OrbitControls/>
            <TresAmbientLight :intensity="1" :color="'white'" cast-shadow />
            <TresHemisphereLight :args="[skyColor, groundColor, 10]" :position="[0,100,0]"/>
            <TresDirectionalLight :position="[-51, 60, -57]" :intensity="11.5" :color="'orange'" ref="sunLight" >
                <Html><div class="light-html">☀️</div></Html>
                <CollisionShape3D :scale="[1,1,1]" :position="[0,0,0]"/>
            </TresDirectionalLight>
            <GLTFModel 
                path="/glbModels/City2/KosowLacki.glb" 
                :position="[0,0,0]"
                :scale="[4,4,4]"
                :rotation="[-Math.PI/2,0,0]"/>



            <GLTFModel 
            v-for="player in players"
                path="/glbModels/2b_low_poly.glb" 
                :position="[player.position.x,25,player.position.z]"
                :scale="[4,4,4]"
                :rotation="[0,Math.PI,0]"
                cast-shadow>
            </GLTFModel>



            



            <StaticModel :path="'/glbModels/City2//Buildings/building04/building04.gltf'" :position="[64,25,3]" cast-shadow/>
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

.light-html{
    background: wheat;
    border: 2px black solid;
}

</style>