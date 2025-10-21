import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

// Layouts
// IMPORTANTE: Crie este componente simples ou use um nome diferente
import RouterOutlet from '@/components/layouts/RouterOutlet.vue'; // Componente com apenas <RouterView />

// Páginas
import LoginPage from "@/pages/common/LoginPage.vue";
import RegisterProviderPage from "@/pages/providers/RegisterProviderPage.vue";
import BarberOnboardingBarber from "@/components/onboarding/BarberOnboardingBarber.vue";
import DashboardProviderPage from "@/pages/providers/DashboardProviderPage.vue"; // Agora é uma página filha
import ServicesProviderPage from "@/pages/providers/ServicesProviderPage.vue";
import ServiceFormPage from "@/pages/providers/ServiceFormPage.vue";
import ManageTeamPage from "@/pages/providers/ManageTeamPage.vue";
import AddTeamMemberPage from "@/pages/providers/AddTeamMemberPage.vue";
import AppointmentsPage from "@/pages/providers/AppointmentsPage.vue";
import AppointmentDetailsPage from "@/pages/providers/AppointmentDetailsPage.vue";
import WorkingHoursPage from "@/pages/providers/WorkingHoursPage.vue";


const routes: Array<RouteRecordRaw> = [
    // --- Rotas Públicas ---
    { path: '/', name: 'Login', component: LoginPage },
    { path: '/provider/register', name: 'RegisterProvider', component: RegisterProviderPage },
    { path: '/provider/onboarding', name: 'BarberOnboardingBarber', component: BarberOnboardingBarber },

    // --- Área Autenticada do Barbeiro ---
    {
        path: '/provider/app',
        component: RouterOutlet, // Usa um LAYOUT GENÉRICO VAZIO como pai
        redirect: { name: 'Dashboard' }, // Redireciona para a rota do dashboard
        // meta: { requiresAuth: true },
        children: [
            {
                // O DASHBOARD AGORA É UMA ROTA FILHA NORMAL
                path: 'dashboard', // URL: /provider/app/dashboard
                name: 'Dashboard', // Nome da rota do Dashboard
                component: DashboardProviderPage, // Usa o seu componente completo
                meta: { title: 'Dashboard' }
            },
            {
                path: 'services', // URL: /provider/app/services
                name: 'Services',
                component: ServicesProviderPage,
                meta: { title: 'Meus Serviços' }
            },
            {
                path: 'service/novo',
                name: 'AddService',
                component: ServiceFormPage,
                meta: { title: 'Adicionar Serviço' }
            },
            {
                path: 'service/editar/:id',
                name: 'EditService',
                component: ServiceFormPage,
                props: true,
                meta: { title: 'Editar Serviço' }
            },
            {
                path: 'equipe',
                name: 'ManageTeam',
                component: ManageTeamPage,
                meta: { title: 'Gerenciar Equipe' }
            },
            {
                path: 'equipe/novo',
                name: 'AddTeamMember',
                component: AddTeamMemberPage,
                meta: { title: 'Adicionar Membro' }
            },
            {
                path: 'agendamentos',
                name: 'Appointments',
                component: AppointmentsPage,
                meta: { title: 'Meus Agendamentos' }
            },
            {
                path: 'agendamento/:id/detalhes',
                name: 'AppointmentDetails',
                component: AppointmentDetailsPage,
                props: true,
                meta: { title: 'Detalhes do Agendamento' }
            },
            {
                path: 'horarios',
                name: 'WorkingHours',
                component: WorkingHoursPage,
                meta: { title: 'Horários de Funcionamento' }
            }
        ]
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    scrollBehavior: () => ({ top: 0 }), // Opcional: Rola para o topo
});

export default router;