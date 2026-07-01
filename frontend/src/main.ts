import { createApp, type App as VueApp } from 'vue';
import { createPinia, type Pinia } from 'pinia';
import App from './App.vue';
import router from './router';
import './styles/main.css';

const app: VueApp<Element> = createApp(App);
const pinia: Pinia = createPinia();

app.use(pinia);
app.use(router);
app.mount('#app');
