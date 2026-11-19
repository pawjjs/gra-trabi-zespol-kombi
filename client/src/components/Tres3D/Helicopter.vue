<script setup>
import { useGLTF, useAnimations } from '@tresjs/cientos'

const { state, isLoading , isReady, error } = await useGLTF('/glbModels/Helicopter/animated_civilian_helicopter/scene.gltf');
const scene = state.value.scene;
const animations = state.value.animations;
const { actions } = useAnimations(animations, scene)

Object.values(actions)[0]?.play();
</script>

<template>
    <TresGroup v-if="scene">
        <primitive :object="scene" :position="[5, 0, 0]" />
    </TresGroup>
</template>