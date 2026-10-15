<script setup>
import './style.css'
import { onMounted } from 'vue';
import { initializeApp } from 'firebase/app';

onMounted(async () => {
  const res = await fetch('/api/firebase-config');
  const firebaseApp = initializeApp(await res.json());
  console.log('Firebase działa:', firebaseApp.options.projectId);
});
</script>

<template>
  <div class="screen-wrapper">
    <div class="screen-menu">  
      <RouterView />
    </div>
    <div class="screen-background">
      <div class="skylight-container">
        <div class="skylight"></div>
        <div class="skylight"></div>
        <div class="skylight"></div>
        <div class="skylight"></div>
        <div class="skylight"></div>
        <div class="skylight"></div>
      </div>
    </div>
  </div>
</template>




