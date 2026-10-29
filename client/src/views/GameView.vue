<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { Game } from '../game/Game.js';

const container   = ref(null);
const falls       = ref(0);
const showFallMsg = ref(false);
const message     = ref('Spadłeś!');

let game = null;
let unmounted = false;

onMounted(async () => 
{
  let playerColor = '#ff4d6d';
  try 
  {
    const res = await fetch('/api/game');
    const data = await res.json();
    message.value = data.message;
    playerColor = data.playerColor;
  } 
  catch (err) 
  {
    console.error('Nie udało się pobrać /api/game:', err);
  }
  if (unmounted) 
  {
    return;
  }
  game = new Game(container.value, {
    playerColor,
    onFall: (n) => 
    { 
      falls.value = n; 
      showFallMsg.value = true; 
    },
    onRespawn: () => 
    {
      showFallMsg.value = false; 
    },
  });
  game.start();
});

onBeforeUnmount(() => 
{
  unmounted = true;
  game?.destroy();
});
</script>

<template>
  <div class="game-wrap">
    <div ref="container" class="game-canvas"></div>
    <div class="hud">
      R - wróć na start<br />
      Upadki: {{ falls }}
    </div>

    <div class="msg" :class="{ show: showFallMsg }">{{ message }}</div>
  </div>
</template>

<style scoped>
.game-wrap {
  position: relative;
  flex: 1;
  min-height: 780px;
  background: #0b1020;
  overflow: hidden;
}
.game-canvas {
  position: absolute;
  inset: 0;
}
.game-canvas :deep(canvas) {
  display: block;
  width: 100%;
  height: 100%;
}
.hud {
  position: absolute;
  top: 12px;
  left: 12px;
  color: #fff;
  font-size: 14px;
  line-height: 1.5;
  text-align: left;
  background: rgba(105, 0, 0, 0.45);
  padding: 10px 14px;
  border-radius: 8px;
  pointer-events: none;
}
.msg {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 48px;
  font-weight: 700;
  text-shadow: 0 2px 12px #000;
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
}
.msg.show {
  opacity: 1;
}
</style>