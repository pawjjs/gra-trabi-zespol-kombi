<script setup>
import { useFirebase } from './store/firebase';
import { storeToRefs } from "pinia";
import {until} from '@vueuse/core';

const store = useFirebase();
const { isAuthReady } = storeToRefs(store);
await until(isAuthReady).toBe(true);
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