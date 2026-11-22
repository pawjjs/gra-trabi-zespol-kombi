<script setup>
import * as THREE from 'three';

const props = defineProps({
    scale: {type:Array,default: [1,1,1]},
    position: {type:Array,default: [0,0,0]},
});
//-------------------------------
const k = 0.02;

</script>

<template>
  <TresGroup>
    <TresMesh :scale="[scale[0],k,k]" :position="[position[0],position[1]+scale[1]/2,position[2]+scale[2]/2]">
        <TresBoxGeometry />
        <TresMeshNormalMaterial />
    </TresMesh>
    <TresMesh :scale="[scale[0],k,k]" :position="[position[0],position[1]+scale[1]/2,position[2]-scale[2]/2]">
        <TresBoxGeometry />
        <TresMeshNormalMaterial />
    </TresMesh>
    <TresMesh :scale="[scale[0],k,k]" :position="[position[0],position[1]-scale[1]/2,position[2]+scale[2]/2]">
        <TresBoxGeometry />
        <TresMeshNormalMaterial />
    </TresMesh>
    <TresMesh :scale="[scale[0],k,k]" :position="[position[0],position[1]-scale[1]/2,position[2]-scale[2]/2]">
        <TresBoxGeometry />
        <TresMeshNormalMaterial />
    </TresMesh>
    <TresMesh :scale="[k,scale[1],k]" :position="[position[0]+scale[0]/2,position[1],position[2]+scale[2]/2]">
        <TresBoxGeometry />
        <TresMeshNormalMaterial />
    </TresMesh>
    <TresMesh :scale="[k,scale[1],k]" :position="[position[0]-scale[0]/2,position[1],position[2]+scale[2]/2]">
        <TresBoxGeometry />
        <TresMeshNormalMaterial />
    </TresMesh>
    <TresMesh :scale="[k,scale[1],k]" :position="[position[0]+scale[0]/2,position[1],position[2]-scale[2]/2]">
        <TresBoxGeometry />
        <TresMeshNormalMaterial />
    </TresMesh>
    <TresMesh :scale="[k,scale[1],k]" :position="[position[0]-scale[0]/2,position[1],position[2]-scale[2]/2]">
        <TresBoxGeometry />
        <TresMeshNormalMaterial />
    </TresMesh>
    <TresMesh :scale="[k,k,scale[2]]" :position="[position[0]-scale[0]/2,position[1]-scale[1]/2,position[2]]">
        <TresBoxGeometry />
        <TresMeshNormalMaterial />
    </TresMesh>
    <TresMesh :scale="[k,k,scale[2]]" :position="[position[0]-scale[0]/2,position[1]+scale[1]/2,position[2]]">
        <TresBoxGeometry />
        <TresMeshNormalMaterial />
    </TresMesh>
    <TresMesh :scale="[k,k,scale[2]]" :position="[position[0]+scale[0]/2,position[1]-scale[1]/2,position[2]]">
        <TresBoxGeometry />
        <TresMeshNormalMaterial />
    </TresMesh>
    <TresMesh :scale="[k,k,scale[2]]" :position="[position[0]+scale[0]/2,position[1]+scale[1]/2,position[2]]">
        <TresBoxGeometry />
        <TresMeshNormalMaterial />
    </TresMesh>
  </TresGroup>
</template>
