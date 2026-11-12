<script setup>
import { TresCanvas } from '@tresjs/core';
import { OrbitControls, Environment } from '@tresjs/cientos';
import { EffectComposer, UnrealBloom } from '@tresjs/post-processing';
import { computed, onMounted, ref , useTemplateRef, watch, watchEffect} from 'vue';
import * as THREE from 'three';

import { usePointerLock } from '@vueuse/core';

import Player from './Player.vue';
//<------------------------------------------------------------------------->

const mouseHover = ref(0);//0 false, 1 true

const GROUND_SIZE = 45;
const geometry = new THREE.BoxGeometry(1,1,1);
const material = new THREE.MeshBasicMaterial();
const box = new THREE.Mesh(geometry,material);
box.position.set(1,0.51,-1);

const canvasContainer = useTemplateRef("canvas_container");
const canvas = computed(() => {
    return canvasContainer.value?.firstElementChild;
});

const {
  isSupported,
  lock,
  unlock,
  element,
  triggerElement
} = usePointerLock(canvas);


//<TresGroup> </TresGroup>
//<TresMesh v-bind="model" />
</script>

<template>
    <div class="test" ref="canvas_container"
    @mouseleave="() => {mouseHover = 0;}"
    @mousemove="() => {mouseHover = 1;}"
    >
            <TresCanvas clear-color="black" @mousedown.capture="lock">

                <TresAmbientLight :intensity="1" cast-shadow />
                <TresDirectionalLight :position="[5, 8, 5]" :intensity="2.5" />
                <TresDirectionalLight :position="[0, 2, 0]" :intensity="10.2" cast-shadow :color="'teal'"/>

                <TresMesh :rotation="[-Math.PI / 2, 0, 0]">
                    <TresPlaneGeometry :args="[GROUND_SIZE, GROUND_SIZE]" />
                    <TresMeshStandardMaterial color="#2f233F" />
                </TresMesh>

                <TresGridHelper :args="[GROUND_SIZE, GROUND_SIZE]" :position="[0, 0.01, 0]" />
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


                <Player path="/glbModels/2b_low_poly.glb"
                :hover="mouseHover"
                :limit="GROUND_SIZE / 2 - 1"/>
            </TresCanvas>
    </div>
</template>

<style lang="css" scoped>
.test{
    width: 99.4%;
    height: 98%;
    padding: 0.3vw;
}
</style>