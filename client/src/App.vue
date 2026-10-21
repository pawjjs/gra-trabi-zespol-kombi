<script setup>
import './style.css';
import { useFirebase } from './store/firebase';
import { onMounted } from 'vue';
import { useAuth , provideAuth} from './hooks/useAuth.js';

//const firebase = useFirebase();
provideAuth();

onMounted(() => {
  //console.log(firebase.auth);
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




