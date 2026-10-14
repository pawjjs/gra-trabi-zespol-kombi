<script setup>
import './style.css'
</script>

<template>
  <div class="screen-wrapper">
    <div class="screen-menu">  
      <nav>
        <RouterLink to="/hello">Hello</RouterLink> |
        <RouterLink to="/goodbye">Goodbye</RouterLink> |
        <RouterLink to="/game">Graj</RouterLink>
      </nav>
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
<!-- 

  












--> 
</template>
