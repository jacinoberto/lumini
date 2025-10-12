import { createApp } from 'vue'
import App from './App.vue'
import './assets/styles/main.css';
import router from '@/router/index.ts'
import VueFeather from 'vue-feather';
import { mask } from 'vue-the-mask';

const app = createApp(App);

if (VueFeather.name != null) {
    app.component(VueFeather.name, VueFeather);
}

app.directive(mask);
app.use(router);
app.mount('#app')
