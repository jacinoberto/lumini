import { createRouter, createWebHistory } from 'vue-router';
//import HomePage from '@/views/HomePage.vue';
import LoginPage from "@/pages/common/LoginPage.vue";
import RegisterProviderPage from "@/pages/providers/RegisterProviderPage.vue";

const routes = [
    /*{
        path: '/',
        name: 'Home',
        component: HomePage,
    },*/
    {
        path: '/',
        name: 'Login',
        component: LoginPage,
    },
    {
        path: '/provider-register',
        name: 'RegisterProvider',
        component: RegisterProviderPage,
    }
];

const router = createRouter({
    // createWebHistory() usa a History API do navegador para navegação sem o '#' na URL
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

export default router;