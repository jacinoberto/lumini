import { createApp } from 'vue'
import App from './App.vue'
import './assets/styles/main.css';
import router from '@/router/index.ts'
import VueFeather from 'vue-feather';

const app = createApp(App);

if (VueFeather.name != null) {
    app.component(VueFeather.name, VueFeather);
}

app.use(router);
app.mount('#app')
