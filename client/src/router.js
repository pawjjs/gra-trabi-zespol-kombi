import { createRouter, createWebHistory } from 'vue-router';

import StartScreen from './views/StartScreen/StartScreen.vue';
import Form        from './views/StartScreen/Form.vue';
import GameView    from './views/GameView.vue';
import HomePage    from './views/HomePage/HomePage.vue';
import Test from './views/Test.vue';

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: StartScreen,
      children: [
        { path: '', redirect: '/login' },//?
        { path: 'login', component: Form, props: { type: 'L' } },
        { path: 'register', component: Form, props: { type: 'R' } },
        { path: 'home', component: HomePage }
      ],
    },

    { path: '/game', component: GameView },
    { path: '/test', component: Test},

    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
});
