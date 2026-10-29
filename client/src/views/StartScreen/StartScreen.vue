<script setup>
import './style.css'
</script>

<template>
    <div class="title-wrapper">
        <header class="title">
            <p class="glitchN" data-text="N">N</p>
            <p class="glitchI" data-text="i">i</p>
            <p class="glitchE" data-text="e">e</p>
            <p class="glitchR" data-text="r">r</p>
            <div style="background-color: yellow;">
                <b class="glitchJ">J</b>
                <b class="glitchS">S</b>
            </div>
        </header>
        <div class="start-form">
          <RouterView :key="$route.path" />
        </div>
    </div>
</template>