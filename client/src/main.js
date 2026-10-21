import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { useFirebase } from './store/firebase.js';

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
useFirebase().init();
app.use(router);
app.mount('#app');