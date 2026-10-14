import { createRouter, createWebHistory } from 'vue-router';
import HelloWorld from './views/HelloWorld.vue';
import GoodbyeWorld from './views/GoodbyeWorld.vue';
import GameView from './views/GameView.vue';

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/hello', component: HelloWorld },
    { path: '/goodbye', component: GoodbyeWorld },
    { path: '/game', component: GameView },
  ],
});
