<script setup>
import './style.css';
import { useFirebase } from './store/firebase';
import { onMounted } from 'vue';

//const firebase = useFirebase();
//provideAuth();

//onMounted(async () => {
//  console.log(firebase.user); 
//});

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




