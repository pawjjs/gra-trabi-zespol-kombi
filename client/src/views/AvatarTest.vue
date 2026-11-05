<template>
  <input type="file" @change="upload" />
  <img v-if="url" :src="url" width="200" />
</template>

<script setup>
import { ref } from 'vue';

const url = ref('');

const upload = async (e) => {
  const body = new FormData();
  body.append('avatar', e.target.files[0]);

  const res = await fetch('http://localhost:3000/api/upload', { method: 'POST', body });
  const data = await res.json();
  
  url.value = `http://localhost:3000/uploads/${data.filename}`;
};
</script>