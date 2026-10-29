<script setup lang="ts">
import { onBeforeUnmount, onMounted, shallowRef } from 'vue'
import { useLoop } from '@tresjs/core'
import * as THREE from 'three'
import Model from './Model.vue'

const props = withDefaults(
  defineProps<{
    path: string
    scale?: number
    /** Obrót modelu wewnątrz grupy. Jeśli postać idzie tyłem, ustaw Math.PI */
    modelYaw?: number
    /** Połowa długości boku podłogi – postać nie wyjdzie poza nią */
    limit?: number
  }>(),
  { scale: 1, modelYaw: 0, limit: 24 },
)

// --- parametry do dostrojenia ---
const MOVE_SPEED = 4
const SPRINT_MULT = 2.8
const TURN_SPEED = 2.6
const JUMP_SPEED = 7
const GRAVITY = 20
const CAM_DISTANCE = 3
const CAM_HEIGHT = 3
const CAM_LOOK_HEIGHT = 1.5
const CAM_SMOOTH = 100

const player = shallowRef<THREE.Group>()
const camera = shallowRef<THREE.PerspectiveCamera>()

const keys: Record<string, boolean> = {}
let velocityY = 0
let grounded = true
let cameraReady = false
const desired = new THREE.Vector3()
const lookTarget = new THREE.Vector3()

const onKeyDown = (e: KeyboardEvent) => {
  if (e.code === 'Space' || e.code.startsWith('Arrow')) e.preventDefault()
  keys[e.code] = true
}
const onKeyUp = (e: KeyboardEvent) => {
  keys[e.code] = false
}
const releaseAll = () => {
  for (const k in keys) keys[k] = false
}

onMounted(() => {
  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('keyup', onKeyUp)
  window.addEventListener('blur', releaseAll)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeyDown)
  window.removeEventListener('keyup', onKeyUp)
  window.removeEventListener('blur', releaseAll)
})

const { onBeforeRender } = useLoop()

onBeforeRender(({ delta }) => {
  const p = player.value
  const cam = camera.value
  if (!p || !cam) return

  const dt = Math.min(delta, 0.05)

  // obrót: A / D lub strzałki
  const turn =
    (keys.KeyA || keys.ArrowLeft ? 1 : 0) - (keys.KeyD || keys.ArrowRight ? 1 : 0)
  p.rotation.y += turn * TURN_SPEED * dt

  // ruch: W / S lub strzałki
  const move = (keys.KeyW || keys.ArrowUp ? 1 : 0) - (keys.KeyS || keys.ArrowDown ? 1 : 0)
  const speed = MOVE_SPEED * (keys.ShiftLeft || keys.ShiftRight ? SPRINT_MULT : 1)
  const yaw = p.rotation.y
  p.position.x += -Math.sin(yaw) * move * speed * dt
  p.position.z += -Math.cos(yaw) * move * speed * dt

  // granice podłogi
  p.position.x = THREE.MathUtils.clamp(p.position.x, -props.limit, props.limit)
  p.position.z = THREE.MathUtils.clamp(p.position.z, -props.limit, props.limit)

  // skok + grawitacja
  if (keys.Space && grounded) {
    velocityY = JUMP_SPEED
    grounded = false
  }
  velocityY -= GRAVITY * dt
  p.position.y += velocityY * dt
  if (p.position.y <= 0) {
    p.position.y = 0
    velocityY = 0
    grounded = true
  }

  // kamera za plecami postaci
  desired.set(
    p.position.x + Math.sin(yaw) * CAM_DISTANCE,
    CAM_HEIGHT + p.position.y * 0.5,
    p.position.z + Math.cos(yaw) * CAM_DISTANCE,
  )
  if (!cameraReady) {
    cam.position.copy(desired)
    cameraReady = true
  } else {
    cam.position.lerp(desired, 1 - Math.exp(-CAM_SMOOTH * dt))
  }
  lookTarget.set(p.position.x, CAM_LOOK_HEIGHT + p.position.y * 0.5, p.position.z)
  cam.lookAt(lookTarget)
})
</script>

<template>
  <TresPerspectiveCamera ref="camera" :fov="45" make-default />

  <TresGroup ref="player">
    <TresGroup :rotation="[0, modelYaw+3, 0]" :scale="[scale, scale, scale]" cast-shadow>
      <Model :path="path" cast-shadow/>
    </TresGroup>
  </TresGroup>
</template>
