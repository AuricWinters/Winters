import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { vSpotlight, vTilt, vMagnet } from './directives/reactBits.js';
import './styles/main.css';

const app = createApp(App);
const pinia = createPinia();

// 注册 React Bits 动效指令
app.directive('spotlight', vSpotlight);
app.directive('tilt', vTilt);
app.directive('magnet', vMagnet);

app.use(pinia);
app.use(router);
app.mount('#app');
