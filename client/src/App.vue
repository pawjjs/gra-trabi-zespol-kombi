<script setup>
import './style.css';
import firebaseLoader from './firebaseLoader.vue';
</script>

<template>
  <Suspense>
    <firebaseLoader />
    <template #fallback>
    <div class="screen-wrapper">
      <div class="screen-menu"> 
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
  </Suspense>
</template>




