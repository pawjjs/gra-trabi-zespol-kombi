<script setup>
import { ref, onMounted } from 'vue';

const message = ref('Ładowanie...');

onMounted(async () => {
  const res = await fetch('/api/goodbye');
  message.value = (await res.json()).message;
});
</script>

<template>
  <h1>{{ message }}</h1>
</template>