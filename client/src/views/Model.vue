<script setup lang="ts">
import { computed } from 'vue'
import { useGLTF } from '@tresjs/cientos'

const props = defineProps<{ path: string }>()

const { state } = useGLTF(props.path) as any

const scene = computed(() => state?.value?.scene ?? state?.scene)
</script>

<template>
  <TresGroup v-if="scene">
    <primitive :object="scene" cast-shadow />
  </TresGroup>
</template>