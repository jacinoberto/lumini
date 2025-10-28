import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

// --- Layout Genérico para Rotas Aninhadas ---
// Certifique-se de que este componente existe em src/layouts/RouterOutlet.vue
// Ele deve conter apenas <RouterView />
import RouterOutlet from '@/components/layouts/RouterOutlet.vue';

// --- Páginas Públicas ---
import LoginPage from "@/pages/common/LoginPage.vue";
import RegisterProviderPage from "@/pages/providers/RegisterProviderPage.vue";

// --- Fluxo de Onboarding ---
import BarberOnboardingBarber from "@/components/onboarding/BarberOnboardingBarber.vue"; // Componente do Wizard

// --- Páginas da Área Autenticada ---
import DashboardProviderPage from "@/pages/providers/DashboardProviderPage.vue";
import ServicesProviderPage from "@/pages/providers/ServicesProviderPage.vue";
import ServiceFormPage from "@/pages/providers/ServiceFormPage.vue";
import ManageTeamPage from "@/pages/providers/ManageTeamPage.vue";
import AddTeamMemberPage from "@/pages/providers/AddTeamMemberPage.vue";
import AppointmentsPage from "@/pages/providers/AppointmentsPage.vue";
import AppointmentDetailsPage from "@/pages/providers/AppointmentDetailsPage.vue";
import WorkingHoursPage from "@/pages/providers/WorkingHoursPage.vue";

// Definição das rotas
const routes: Array<RouteRecordRaw> = [
    // --- Rotas Públicas ---
    {
        path: '/',
        name: 'Login',
        component: LoginPage,
        meta: { title: 'Login' }
    },
    {
        path: '/provider/register',
        name: 'RegisterProvider',
        component: RegisterProviderPage,
        meta: { title: 'Cadastro de Barbeiro' }
    },
    // --- Rota de Onboarding (pós-registro) ---
    {
        path: '/provider/onboarding',
        name: 'BarberOnboardingBarber',
        component: BarberOnboardingBarber,
        meta: { title: 'Configuração Inicial', requiresAuth: true, role: 'OWNER' } // Protegida
    },

    // --- Área Autenticada do Barbeiro ---
    {
        path: '/provider/app', // Prefixo principal da área logada
        component: RouterOutlet, // Usa um Layout Genérico VAZIO como pai
        redirect: { name: 'Dashboard' }, // Redireciona /provider/app para a rota do dashboard
        meta: {
            requiresAuth: true, // Indica que precisa estar logado
            role: 'OWNER'       // Indica que precisa ter a role 'OWNER'
        },
        children: [
            {
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
                path: 'service/novo', // URL: /provider/app/service/novo
                name: 'AddService',
                component: ServiceFormPage,
                meta: { title: 'Adicionar Serviço' }
            },
            {
                path: 'service/editar/:id', // URL: /provider/app/service/editar/123
                name: 'EditService',
                component: ServiceFormPage,
                props: true, // Passa o :id como prop para ServiceFormPage
                meta: { title: 'Editar Serviço' }
            },
            {
                path: 'equipe', // URL: /provider/app/equipe
                name: 'ManageTeam',
                component: ManageTeamPage,
                meta: { title: 'Gerenciar Equipe' }
            },
            {
                path: 'equipe/novo', // URL: /provider/app/equipe/novo
                name: 'AddTeamMember',
                component: AddTeamMemberPage,
                meta: { title: 'Adicionar Membro' }
            },
            {
                path: 'equipe/editar/:memberId', // :memberId é o parâmetro
                name: 'EditTeamMember',
                component: AddTeamMemberPage, // Reutiliza o mesmo formulário
                props: true, // Passa o :memberId como prop
                meta: { title: 'Editar Membro' }
            },
            {
                path: 'agendamentos', // URL: /provider/app/agendamentos
                name: 'Appointments',
                component: AppointmentsPage,
                meta: { title: 'Meus Agendamentos' }
            },
            {
                path: 'agendamento/:id/detalhes', // URL: /provider/app/agendamento/456/detalhes
                name: 'AppointmentDetails',
                component: AppointmentDetailsPage,
                props: true, // Passa o :id como prop para AppointmentDetailsPage
                meta: { title: 'Detalhes do Agendamento' }
            },
            {
                path: 'horarios', // URL: /provider/app/horarios
                name: 'WorkingHours',
                component: WorkingHoursPage,
                meta: { title: 'Horários de Funcionamento' }
            }
            // Adicione outras rotas filhas aqui
        ]
    },

    // --- Rota Catch-all (404 Not Found) ---
    // {
    //   path: '/:catchAll(.*)', // Captura qualquer rota não definida
    //   name: 'NotFound',
    //   component: () => import('@/pages/NotFoundPage.vue') // Crie esta página
    // }
];

// Criação da instância do roteador
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    // Opcional: Rola a página para o topo ao navegar
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        } else {
            return { top: 0 };
        }
    },
});

// --- GUARDA DE ROTA GLOBAL ---
router.beforeEach((to, from, next) => {
    // Verifica se a rota de destino (ou alguma rota pai) requer autenticação
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    // Encontra a role exigida pela rota mais específica (se houver)
    const requiredRole = to.matched.slice().reverse().find(record => record.meta.role)?.meta.role as string | undefined;

    const token = localStorage.getItem('authToken');
    const userDataString = localStorage.getItem('userData');
    let userRole: string | null = null;

    if (userDataString) {
        try {
            userRole = JSON.parse(userDataString).role;
        } catch (e) {
            console.error("Erro ao parsear dados do usuário:", e);
            // Limpa dados inválidos para forçar novo login
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
            localStorage.removeItem('barbershopId');
        }
    }

    // Lógica de Redirecionamento
    if (requiresAuth) { // Se a rota é protegida
        if (!token) { // E não há token
            next({ name: 'Login', query: { redirect: to.fullPath } }); // Redireciona para Login, guardando a rota original
        } else { // Se há token
            if (requiredRole) { // E a rota exige uma role específica
                if (userRole === requiredRole) { // E o usuário tem a role correta
                    next(); // Permite o acesso
                } else { // Usuário tem token, mas role errada
                    console.warn(`Acesso negado: Rota requer role '${requiredRole}', usuário tem role '${userRole}'`);
                    next({ name: 'Login' }); // Redireciona para Login (ou uma página 'Não Autorizado')
                }
            } else { // Rota protegida, mas não exige role específica
                next(); // Permite o acesso (só precisa de token)
            }
        }
    } else { // Se a rota é pública
        next(); // Permite o acesso
    }
});

export default router;