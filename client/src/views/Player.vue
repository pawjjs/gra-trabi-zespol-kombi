<script setup >

import { onBeforeUnmount, onMounted, shallowRef, reactive, ref, watch } from 'vue'
import { useLoop } from '@tresjs/core'
import * as THREE from 'three';
import Model from './Model.vue'
import { OrbitControls } from '@tresjs/cientos';
import {useMouse} from '@vueuse/core';

const props = defineProps({
  path: {type: String},
  scale: {type: Number, default: 1},
  modelYaw: {type:Number, default: Math.PI},
  /**            Math.PI
  * 
  *-Math.PI/2      X       Math.PI/2
  * 
  *                0                 */
 hover: {type: Number, default: 1},
 limit: {type: Number, default: 24}//limit area
});

const keys = {};// Array which keys are pressed <boolean>
const { x, y, sourceType } = useMouse({ type: 'movement' });

const playerRef = shallowRef();
const cameraRef = shallowRef();
let cameraReady = false;
const FOV = 45;//CoD wanna be :P

const MOVE_SPEED = 2.1;
const SPRINT_MULT = 4.8;
const TURN_SPEED = 3.6;

const JUMP_SPEED = 7
const GRAVITY = 20;
let velocityY = 0;
let grounded = true;

let CAM_DISTANCE = 3.5;
const CAM_HEIGHT = 2;
const CAM_LOOK_HEIGHT = 1.5;
const CAM_SMOOTH = 100;

const desired = new THREE.Vector3()
const lookTarget = new THREE.Vector3()

//set key[Event.code] = true
const onKeyDown = (e) => {
  console.log(e.code);
  if (e.code === 'Space') 
  {
    e.preventDefault();
  }
  keys[e.code] = true
}
//set key[Event.code] = false
const onKeyUp = (e) => {
  keys[e.code] = false
}
//set all keys[Event.code] = false
const releaseAll = () => {
  for (const k in keys) 
  {
    keys[k] = false;
  }
}
// klikanie myszą
const onMouseClick = (e) => {
  if(e.button === 1){
    console.log("Srodkowy")
  }
  if(e.button === 0){
    console.log("lewy")
  }
  if(e.button === 2){
    console.log("prawy")
  }
};
// scrolling - close up/down
const scroll = (e) => {
  if(e.deltaY < 0 && CAM_DISTANCE>1.3){
    CAM_DISTANCE -= 0.1;
    CAM_HEIGHT += 0.1;
  }
  if(e.deltaY > 0 && CAM_DISTANCE<7){
    CAM_DISTANCE += 0.1;
    CAM_HEIGHT -= 0.2;
  }
}

onMounted(() => {

  window.addEventListener('wheel',scroll);
  window.addEventListener('mousedown',onMouseClick);
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
  window.addEventListener('blur', releaseAll);//An element loses focus
})

const { onBeforeRender } = useLoop()

onBeforeRender(({ delta,elapsed }) => {
  const player = playerRef.value;
  const camera = cameraRef.value;
  if (!player || !camera) {
    return;
  }
  const dt = Math.min(delta, 0.05);
  const speed = MOVE_SPEED * (keys.ShiftLeft ? SPRINT_MULT : 1);
  let inputZ = (keys.KeyW ? 1 : 0) - (keys.KeyS ? 1 : 0); // +1 forward; -1 backward
  let inputX = (keys.KeyA ? 1 : 0) - (keys.KeyD ? 1 : 0); // +1 left;    -1 right
  const hypotenuse = Math.hypot(inputX, inputZ);// AND = 1.41 , NAND = 1
  const yaw = player.rotation.y;
  if (hypotenuse > 0) 
  {
    inputX /= hypotenuse;
    inputZ /= hypotenuse;
    // left    = (-sin, -cos), 
    // forward = (-cos, +sin)
    const dirX = -Math.sin(yaw) * inputZ - Math.cos(yaw) * inputX;
    const dirZ = -Math.cos(yaw) * inputZ + Math.sin(yaw) * inputX;
    player.position.x += dirX * speed * dt;
    player.position.z += dirZ * speed * dt;
  }




  // granice podłogi
  player.position.x = THREE.MathUtils.clamp(player.position.x, -props.limit, props.limit)
  player.position.z = THREE.MathUtils.clamp(player.position.z, -props.limit, props.limit)






  // skok + grawitacja
  if (keys.Space && grounded) {
    velocityY = JUMP_SPEED
    grounded = false
  }
  velocityY -= GRAVITY * dt
  player.position.y += velocityY * dt
  if (player.position.y <= 0) {
    player.position.y = 0
    velocityY = 0
    grounded = true
  }






  // kamera za plecami postaci
  desired.set(
    player.position.x + Math.sin(yaw) * CAM_DISTANCE,
    player.position.y * 0.5 + CAM_HEIGHT ,
    player.position.z + Math.cos(yaw) * CAM_DISTANCE,
  );
  if (!cameraReady) {
    camera.position.copy(desired);
    cameraReady = true;
  } else {
    camera.position.lerp(desired, 1 - Math.exp(-CAM_SMOOTH * dt));
  }
  lookTarget.set(player.position.x, CAM_LOOK_HEIGHT + player.position.y * 0.5, player.position.z)
  camera.lookAt(lookTarget)
})


watch([x, y],
  ([newX, newY], [oldX, oldY]) => {
    const player = playerRef.value;
    console.log('Nowa pozycja:', newX, newY);
    console.log('Poprzednia pozycja:', oldX, oldY);

    player.rotation.y += -newX * TURN_SPEED * 0.0005;
    
    
  }
)

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeyDown);
  window.removeEventListener('keyup', onKeyUp);
  window.removeEventListener('blur', releaseAll);
  window.removeEventListener('wheel',scroll);
  window.removeEventListener('mousedown',onMouseClick);
})
</script>

<template>
  <TresPerspectiveCamera ref="cameraRef" :fov="FOV" make-default />
  <TresGroup ref="playerRef">
    <TresGroup :rotation="[0, modelYaw, 0]" :scale="[scale, scale, scale]" cast-shadow>
      <Model :path="path" cast-shadow/>
    </TresGroup>
  </TresGroup>
</template>
