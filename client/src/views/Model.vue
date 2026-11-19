<script setup>
import { computed } from 'vue'
import { useGLTF } from '@tresjs/cientos'

const props = defineProps({ 
  path: {type: String},
  dracoParam: {type: Boolean, default: false},//Whether to enable Draco compression
}) ;

const { state } = useGLTF(props.path, { draco: props.dracoParam });
const scene = computed(() => { return state?.value?.scene ?? state?.scene});

//https://gltf-viewer.donmccurdy.com/
</script>

<template>
  <TresGroup v-if="scene">
    <primitive :object="scene" cast-shadow />
  </TresGroup>
</template>
