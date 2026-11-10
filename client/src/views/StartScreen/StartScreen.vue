<script setup>
</script>

<template>
    <div class="title-wrapper">
        <header class="title">
            <p class="glitch1" data-text="M">M</p>
            <p class="glitch2" data-text="a">a</p>
            <p class="glitch3" data-text="c">c</p>
            <p class="glitch4" data-text="h">h</p>
            <p class="glitch1" data-text="i">i</p>
            <p class="glitch2" data-text="n">n</p>
            <p class="glitch3" data-text="a">a</p>
            <p class="glitch4" data-text="e">e</p>
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

<style scoped>
.title-wrapper{
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 5vw;
}
header.title{
    display: flex;
    align-items: center;
    align-content: center;
    gap: 1vw;
    justify-content: center;
}
p.glitch1,
p.glitch2,
p.glitch3,
p.glitch4{
    --moveX: 0.2vw;
    --moveY: 0.2vw;
    --duration: 0.3s;
    --delay: 0s;
    position: relative;
    font-size: 8.6vw;
    color: white;
}
p.glitch1::after,
p.glitch1::before,
p.glitch2::after,
p.glitch2::before,
p.glitch3::after,
p.glitch3::before,
p.glitch4::after,
p.glitch4::before{
    display: block;
    content: attr(data-text);
    position: absolute;
    top:0;left:0;
    opacity: 0.8;
}
p.glitch1::before,
p.glitch2::before,
p.glitch3::before,
p.glitch4::before{
    animation: glitch-it var(--duration) cubic-bezier(0.25, 0.48, 0.45, 0.94 ) var(--delay) both infinite;
    color: rgb(82, 206, 255);
    z-index: -1;
}
p.glitch1::after,
p.glitch2::after,
p.glitch3::after,
p.glitch4::after{
    animation: glitch-it var(--duration) cubic-bezier(0.25, 0.48, 0.45, 0.94 ) var(--delay) reverse infinite;
    color: rgb(255, 14, 255);
    z-index: -2;
}
p.glitch1{
    --duration: 0.4s;
    --delay : 0s;
    --moveX:0.21vw;
    --moveY:0.2vw;
}
p.glitch2{
    --duration: 0.31s;
    --delay : 0s;
    --moveX:0.18vw;
    --moveY:0.2vw;
}
p.glitch4{
    --duration: 0.31s;
    --delay : 0s;
    --moveX:0.2vw;
    --moveY:0.19vw;
}
@keyframes glitch-it{
    0%{
        transform: translate( calc(-1*var(--moveX))  ,var(--moveY));
    }
    20%{
        transform: translate(var(--moveX),calc(-1*var(--moveY)));
    }
    60%{
        transform: translate(var(--moveX),var(--moveY));
    }
    to
    {
        transform: translate(0);
    }
}
b.glitchJ,
b.glitchS{
    position: relative;
    font-size: 8.6vw;
    color: rgb(0, 0, 0);
    background-color: yellow;
    padding: 0.5vw;
    font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    
}
b.glitchJ{
    display: inline-block;
    animation: displayJ 1.31s infinite;
}
b.glitchS{
    display: inline-block;
    animation: displayS 2.05s infinite;
}
@keyframes displayJ {
  0%, 96.77% {
    opacity: 1;
  }

  96.78%, 100% {
    opacity: 0;
  }
}
@keyframes displayS {
  0%, 95.77% {
    opacity: 1;
  }

  95.78%, 100% {
    opacity: 0;
  }
}
/*///////////////////////////////////////////////////////////////////////////////////////*/
.start-form{
    width: 40vw;
    min-height: 25vw;
    background-color: aliceblue;
}

</style>