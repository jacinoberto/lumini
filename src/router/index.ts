import { createRouter, createWebHistory } from 'vue-router';
//import HomePage from '@/views/HomePage.vue';
import LoginPage from "@/pages/common/LoginPage.vue";
import BarberOnboardingBarber from "@/components/onboarding/BarberOnboardingBarber.vue";

import {
    RegisterProviderPage,
    DashboardProviderPage,
    ServicesProviderPage,
    ServiceFormPage,
    ManagerTeamPage,
    AddTeamMemberPage,
} from "@/pages";

const providerUrl = '/pr/app';

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
        path: '/pr/provider-register',
        name: 'RegisterProvider',
        component: RegisterProviderPage,
    },
    {
        path: '/pr/onboarding',
        name: 'BarberOnboardingBarber',
        component: BarberOnboardingBarber,
    },
    {
        path: providerUrl + '/dashboard',
        name: 'Dashboard',
        component: DashboardProviderPage,
    },
    {
        path: providerUrl + '/services',
        name: 'Services',
        component: ServicesProviderPage,
    },
    {
        path: providerUrl + '/service',
        name: 'Service',
        component: ServiceFormPage,
    },
    {
        path: providerUrl + '/barbers',
        name: 'Barbers',
        component: ManagerTeamPage,
    },
    {
        path: providerUrl + '/barber',
        name: '',
        component: AddTeamMemberPage,
    }
];

const router = createRouter({
    // createWebHistory() usa a History API do navegador para navegação sem o '#' na URL
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

export default router;