<script setup >
import { onBeforeUnmount, onMounted, onUnmounted, shallowRef, ref, watch } from 'vue';
import { useLoop , useTres} from '@tresjs/core';
import * as THREE from 'three';
import Model from './Model.vue';
import {useMouse} from '@vueuse/core';
import { Html } from '@tresjs/cientos';
import { PCFShadowMap } from 'three';
import { BoxGeometry, Mesh, MeshBasicMaterial } from 'three';
//----------------------------------------------------------------------------------------------
const props = defineProps({
  playerLabel: {type: String, default: ""},
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
//-----------------------------------------------------------------------------------------------
//https://stemkoski.github.io/Three.js/Collision-Detection.html

const { scene, renderer, camera, sizes, invalidate, advance } = useTres();

let socket=null;

let CAM_DISTANCE = 3.5;
const CAM_HEIGHT = 2;
const CAM_LOOK_HEIGHT = 1.5;
const CAM_SMOOTH = 100;

const desired = new THREE.Vector3();
const lookTarget = new THREE.Vector3();

const keys = {};// Array which keys are pressed <boolean>
const { x, y, sourceType } = useMouse({ type: 'movement' });
const CameraRotationX = ref(-Math.PI/2);
//const CameraRotationY = ref(CAM_HEIGHT);

const playerLabel = shallowRef();
const playerRef = shallowRef();
const cameraRef = shallowRef();
let cameraReady = false;
const FOV = 45;//CoD wanna be :P

const MOVE_SPEED = 2.1;
const SPRINT_MULT = 4.8;
const TURN_SPEED = 3.6;

const JUMP_SPEED = 6.7;
const GRAVITY = 20;
let velocityY = 0;
let grounded = true;

//set key[Event.code] = true
const onKeyDown = (e) => {
  console.log(e.code);
  if (e.code === 'Space') 
  {
    e.preventDefault();
    if (socket?.readyState === WebSocket.OPEN) 
    {
      socket.send("Hop"); // -> "message"
    }
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
  }
  if(e.deltaY > 0 && CAM_DISTANCE<5){
    CAM_DISTANCE += 0.1;
  }
}




onMounted(() => {
  const geometry = new BoxGeometry(1, 1, 1)
  const material = new MeshBasicMaterial({ color: 0x00FF00 })
  const cube = new Mesh(geometry, material)

  // Add directly to the scene
  scene.value.add(cube)
  //renderer.shadowMap.enabled = true
  //renderer.shadowMap.type = PCFShadowMap

  socket = new WebSocket("ws://localhost:3000");//wss.on("connection")
  socket.onopen = () => {};
  socket.onmessage = (e) => 
  {
    console.log(e.data);
  };

  //console.log('Canvas size:', sizes.width.value, sizes.height.value)
  //console.log(scene.value);
  //console.log(renderer);
  //console.log(camera.value);
  //console.log(sizes);
  //console.log(invalidate);
  //console.log(advance());
  window.addEventListener('wheel',scroll);
  window.addEventListener('mousedown',onMouseClick);
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
  window.addEventListener('blur', releaseAll);//An element loses focus
})

const { onBeforeRender } = useLoop();

//elapsed - time since the begin
onBeforeRender(({ delta,elapsed }) => {
  const player = playerRef.value;
  const camera = cameraRef.value;
  const label = playerLabel.value;
  if (!player || !camera) {
    return;
  }
  const dt = Math.min(delta, 0.05);
  const speed = MOVE_SPEED * (keys.ShiftLeft ? SPRINT_MULT : 1);

  let inputZ = (keys.KeyW ? 1 : 0) - (keys.KeyS ? 1 : 0); // +1 forward; -1 backward
  let inputX = (keys.KeyA ? 1 : 0) - (keys.KeyD ? 1 : 0); // +1 left;    -1 right
  const hypotenuse = Math.hypot(inputX, inputZ);// AND = 1.41 , NAND = 1



  if(inputZ != 0 || inputX != 0)
  {
    player.rotation.y = CameraRotationX.value + Math.atan2(inputX,inputZ) + Math.PI*0.5;
  }
  
  const yaw = player.rotation.y;
  if (hypotenuse > 0) 
  {
    const dirZ = -Math.cos(yaw);
    const dirX = -Math.sin(yaw);
    player.position.z += speed*dt * dirZ;
    player.position.x += speed*dt * dirX;
  }

  // jump + gravity
  //if (keys.Space && grounded) 
  if (keys.Space) 
  {
    velocityY = JUMP_SPEED;
    //grounded = false;
  }
  velocityY -= GRAVITY * dt;
  player.position.y += velocityY * dt;
  //if (player.position.y <= 0)
 // {
    
    //grounded = true;
  //}

  player.position.y = THREE.MathUtils.clamp(player.position.y, 0, 10);
  /*if (player.position.y <= 0)
  {
    player.position.y = 0;
    velocityY = 0;
    grounded = true;
  }*/

  // space limit
  player.position.x = THREE.MathUtils.clamp(player.position.x, -props.limit, props.limit);
  player.position.z = THREE.MathUtils.clamp(player.position.z, -props.limit, props.limit);

  

  //camera
  desired.set(
    player.position.x + Math.cos(CameraRotationX.value)* CAM_DISTANCE,
    player.position.y * 0.5 + CAM_HEIGHT ,
    player.position.z - Math.sin(CameraRotationX.value)* CAM_DISTANCE,
  );
  if (!cameraReady) {
    camera.position.copy(desired);
    cameraReady = true;
  } else {
    camera.position.lerp(desired, 1 - Math.exp(-CAM_SMOOTH * dt));
  }
  lookTarget.set(
    player.position.x, 
    CAM_LOOK_HEIGHT + player.position.y * 0.5 ,
    player.position.z
  );
  camera.lookAt(lookTarget);

  //console.log(label.instance.position);
  label.instance.position.set(
    player.position.x,
    player.position.y + CAM_HEIGHT ,
    player.position.z
  );
})

watch([x, y],
  ([newX, newY], [oldX, oldY]) => {
    CameraRotationX.value += -newX * TURN_SPEED * 0.0005;

    /*CameraRotationY.value += -newY * TURN_SPEED * 0.0005;
    if(CameraRotationY.value >= Math.PI/2){
      CameraRotationY.value = Math.PI/2;
    }
    if(CameraRotationY.value <= -Math.PI){
      CameraRotationY.value = -Math.PI;
    }
    console.log(CameraRotationY.value);*/
  }
)

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeyDown);
  window.removeEventListener('keyup', onKeyUp);
  window.removeEventListener('blur', releaseAll);
  window.removeEventListener('wheel',scroll);
  window.removeEventListener('mousedown',onMouseClick);
});

onUnmounted(() => {
  socket?.close()
});
</script>

<template>
  <TresPerspectiveCamera ref="cameraRef" :fov="FOV" make-default />
  <TresGroup ref="playerRef">
    <TresGroup :rotation="[0, modelYaw, 0]" :scale="[scale, scale, scale]" cast-shadow>
      <Model :path="path" cast-shadow/>
    </TresGroup>
  </TresGroup>
  <Html ref="playerLabel">
    <div class="my-label">
        <p>{{props.playerLabel}}</p>
    </div>
  </Html>
</template>

<style scoped>
.my-label p{
  background-color: white;
  color: rgb(56, 56, 0);
  padding: 0.1vw;
}
</style>