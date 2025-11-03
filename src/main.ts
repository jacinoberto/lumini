import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import './assets/styles/main.css';
import router from '@/router/index';
import VueFeather from 'vue-feather';
import { mask } from 'vue-the-mask';
import api from './services/api';

const app = createApp(App);
const pinia = createPinia();

if (VueFeather.name != null) {
    app.component(VueFeather.name, VueFeather);
}
app.directive('mask', mask);
app.use(pinia);
app.use(router);

if (typeof localStorage !== 'undefined') {
    const token = localStorage.getItem('authToken');
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        console.log("Token carregado do localStorage para o Axios.");
    }
}

app.mount('#app');

