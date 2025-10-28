import { createApp } from 'vue';
import App from './App.vue';
import './assets/styles/main.css'; // Certifique-se que o caminho está correto
import router from '@/router/index'; // Corrigido para remover '.ts'
import VueFeather from 'vue-feather';
import { mask } from 'vue-the-mask';
import api from './services/api'; // 1. Importe a instância do Axios

const app = createApp(App);

// Registros globais
if (VueFeather.name != null) {
    app.component(VueFeather.name, VueFeather);
}
app.directive('mask', mask); // Registra v-mask
app.use(router);

// --- LÓGICA CSRF ---
// 2. Chama o endpoint para obter o cookie CSRF
//    CONFIRME ESTE ENDPOINT com o backend (Orion). '/sanctum/csrf-cookie' é o padrão do Laravel Sanctum.
api.get('/sanctum/csrf-cookie').then(() => {
    // 3. Monte o aplicativo SOMENTE APÓS obter o cookie com sucesso
    app.mount('#app');
}).catch(error => {
    console.error("Erro crucial ao obter o cookie CSRF! A aplicação não será montada.", error);
    // Você pode querer exibir uma mensagem de erro na tela aqui,
    // pois sem o cookie, as requisições POST/PUT/DELETE falharão.
    const rootElement = document.getElementById('app');
    if (rootElement) {
        rootElement.innerHTML = '<div style="color: red; text-align: center; padding-top: 50px;">Erro ao inicializar a aplicação. Verifique a conexão com a API.</div>';
    }
});

// REMOVA a linha app.mount('#app') daqui, pois ela foi movida para dentro do .then()