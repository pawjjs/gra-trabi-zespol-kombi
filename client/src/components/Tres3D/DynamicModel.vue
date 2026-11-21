<script setup>
import { useGLTF, useAnimations } from '@tresjs/cientos'
import { onMounted, shallowRef } from 'vue';

const props = defineProps({ 
  path: {type: String},
  dracoParam: {type: Boolean, default: false},//Whether to enable Draco compression
}) ;

const { state, isLoading , isReady, error } = await useGLTF(props.path, { draco: props.dracoParam });
const scene = shallowRef(state.value.scene);
const animations = shallowRef(state.value.animations);
const { actions } = useAnimations(animations, scene)

onMounted(() => {
    Object.values(actions)[0]?.play();
})
//<slot name="body"/>
</script>

<template>
    <TresGroup v-if="scene">
        <primitive :object="scene" cast-shadow />
    </TresGroup>
</template>