import { createRouter, createWebHistory } from 'vue-router';
//import HelloWorld from './views/HelloWorld.vue';
//import GoodbyeWorld from './views/GoodbyeWorld.vue';

import StartScreen from './views/StartScreen/StartScreen.vue';
import Form from './views/StartScreen/Form.vue';
import GameView from './views/GameView.vue';
import HomePage from './views/HomePage/HomePage.vue';

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: StartScreen,
      children: [
        { path: '', redirect: '/login' },
        { path: 'login', component: Form, props: { type: 'L' } },
        { path: 'register', component: Form, props: { type: 'R' } },
        { path: 'home', component: HomePage },
      ],
    },

    { path: '/game', component: GameView },

    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
});
