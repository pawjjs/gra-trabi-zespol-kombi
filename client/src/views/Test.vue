<script setup>
import { TresCanvas } from '@tresjs/core';
import { OrbitControls, Environment } from '@tresjs/cientos';
import { EffectComposer, UnrealBloom } from '@tresjs/post-processing';
import { ref , watch} from 'vue';
import * as THREE from 'three';


import Model from './Model.vue';
import Player from './Player.vue';
import './test.css';
//<------------------------------------------------------------------------->

const GROUND_SIZE = 50;

//https://threejs.org/docs/

const geometry = new THREE.BoxGeometry(1,1,1);
const material = new THREE.MeshBasicMaterial();
const box = new THREE.Mesh(geometry,material);
box.position.set(0,0.51,-5);

//const fov = ref(40)

/*
setTimeout(() => {
    fov.value = 60;
},2000)                 // po 2 sekundach dzieje sie
*/

// 
//<TresGroup> </TresGroup>
//<TresMesh v-bind="model" />
</script>

<template>
    <div class="test">
        <TresCanvas clear-color="black">
            <TresAmbientLight :intensity="1.4" cast-shadow />
            <TresDirectionalLight :position="[0, 2, 0]" :intensity="10.2" cast-shadow :color="'teal'" />
            <TresDirectionalLight :position="[5, 8, 5]" :intensity="2.5" />
            <TresMesh :rotation="[-Math.PI / 2, 0, 0]">
                <TresPlaneGeometry :args="[GROUND_SIZE, GROUND_SIZE]" />
                <TresMeshStandardMaterial color="#2a2d33" />
            </TresMesh>
            <TresGridHelper :args="[GROUND_SIZE, GROUND_SIZE]" :position="[0, 0.01, 0]" />
            <Player path="/2b_low_poly.glb" :limit="GROUND_SIZE / 2 - 1" />
            <primitive :object="box" />
            <TresMesh :position="[13,0,1]" :rotation="[0,3,0]" :scale="[1,1,1]">
                <TresSphereGeometry />
                <TresMeshBasicMaterial 
                    :color="'teal'"
                />
            </TresMesh>
            <TresMesh :position="[-10,0.5,-14]">
                <TresBoxGeometry />
                <TresMeshNormalMaterial />
            </TresMesh>
        </TresCanvas>
    </div>
</template>
