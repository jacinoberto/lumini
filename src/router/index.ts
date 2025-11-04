// src/router/index.ts

import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

// APENAS o RouterOutlet é importado estaticamente
const RouterOutlet = { template: '<RouterView />' };

const routes: Array<RouteRecordRaw> = [
    // ==========================================
    // ROTA INICIAL - ESCOLHER TIPO DE CONTA
    // ==========================================
    {
        path: '/',
        name: 'AccountType',
        component: () => import('@/pages/common/AccountTypePage.vue'),
        meta: { title: 'Tipo de Conta' }
    },

    // ==========================================
    // ROTAS PÚBLICAS
    // ==========================================
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/pages/common/LoginPage.vue'),
        meta: { title: 'Login' }
    },
    {
        path: '/provider/register',
        name: 'RegisterProvider',
        component: () => import('@/pages/providers/RegisterProviderPage.vue'),
        meta: { title: 'Cadastro de Barbeiro' }
    },
    {
        path: '/client/register',
        name: 'RegisterClient',
        component: () => import('@/pages/clients/RegisterClientPage.vue'),
        meta: { title: 'Cadastro de Clienteash' }
    },

    // ==========================================
    // ONBOARDING DO BARBEIRO
    // ==========================================
    {
        path: '/provider/onboarding',
        name: 'BarberOnboardingBarber',
        component: () => import('@/components/onboarding/BarberOnboardingBarber.vue'),
        meta: {
            title: 'Configuração Inicial',
            requiresAuth: true,
            role: 'OWNER'
        }
    },

    // ==========================================
    // ÁREA DO BARBEIRO (PROVIDER)
    // ==========================================
    {
        path: '/provider/app',
        component: RouterOutlet,
        redirect: { name: 'Dashboard' },
        meta: {
            requiresAuth: true,
            role: 'OWNER'
        },
        children: [
            {
                path: 'dashboard',
                name: 'Dashboard',
                component: () => import('@/pages/providers/DashboardProviderPage.vue'),
                meta: { title: 'Dashboard' }
            },
            {
                path: 'services',
                name: 'Services',
                component: () => import('@/pages/providers/ServicesProviderPage.vue'),
                meta: { title: 'Meus Serviços' }
            },
            {
                path: 'service/novo',
                name: 'AddService',
                component: () => import('@/pages/providers/ServiceFormPage.vue'),
                meta: { title: 'Adicionar Serviço' }
            },
            {
                path: 'service/editar/:id',
                name: 'EditService',
                component: () => import('@/pages/providers/ServiceFormPage.vue'),
                props: true,
                meta: { title: 'Editar Serviço' }
            },
            {
                path: 'equipe',
                name: 'ManageTeam',
                component: () => import('@/pages/providers/ManageTeamPage.vue'),
                meta: { title: 'Gerenciar Equipe' }
            },
            {
                path: 'equipe/novo',
                name: 'AddTeamMember',
                component: () => import('@/pages/providers/AddTeamMemberPage.vue'),
                meta: { title: 'Adicionar Membro' }
            },
            {
                path: 'equipe/editar/:memberId',
                name: 'EditTeamMember',
                component: () => import('@/pages/providers/AddTeamMemberPage.vue'),
                props: true,
                meta: { title: 'Editar Membro' }
            },
            {
                path: 'agendamentos',
                name: 'Appointments',
                component: () => import('@/pages/providers/AppointmentsPage.vue'),
                meta: { title: 'Meus Agendamentos' }
            },
            {
                path: 'agendamento/:id/detalhes',
                name: 'AppointmentDetails',
                component: () => import('@/pages/providers/AppointmentDetailsPage.vue'),
                props: true,
                meta: { title: 'Detalhes do Agendamento' }
            },
            {
                path: 'horarios',
                name: 'WorkingHours',
                component: () => import('@/pages/providers/WorkingHoursPage.vue'),
                meta: { title: 'Horários de Funcionamento' }
            },
            {
                path: 'profile',
                name: 'ProviderProfile',
                component: () => import('@/pages/providers/ProviderProfilePage.vue'),
                meta: { title: 'Perfil' }
            },
            {
                path: 'clients',
                name: 'ClientsList',
                component: () => import('@/pages/providers/ClientsListPage.vue'),
                meta: { title: 'Meus Clientes' }
            },
            {
                path: 'clients/:clientId',
                name: 'ClientDetails',
                component: () => import('@/pages/providers/ClientDetailsPage.vue'),
                props: true,
                meta: { title: 'Detalhes do Cliente' }
            },
            {
                path: 'edit-barbershop',
                name: 'EditBarbershop',
                component: () => import('@/pages/providers/EditBarbershopPage.vue'),
                meta: { title: 'Editar Barbearia' }
            },
        ]
    },

    // ==========================================
    // ÁREA DO CLIENTE
    // ==========================================
    {
        path: '/client',
        component: RouterOutlet,
        redirect: { name: 'ClientDashboard' },
        meta: {
            requiresAuth: true,
            role: 'CLIENT'
        },
        children: [
            {
                path: 'dashboard',
                name: 'ClientDashboard',
                component: () => import('@/pages/clients/ClientDashboardPage.vue'),
                meta: { title: 'Início' }
            },
            {
                path: 'barbershop/:id',
                name: 'BarbershopDetails',
                component: () => import('@/pages/clients/BarbershopDetailsPage.vue'),
                props: true,
                meta: { title: 'Detalhes da Barbearia' }
            },
            {
                path: 'barbershop/:id/booking',
                name: 'BarbershopBooking',
                component: () => import('@/pages/clients/BarbershopBookingPage.vue'),
                props: true,
                meta: { title: 'Agendar Horário' }
            },
            {
                path: 'appointments',
                name: 'ClientAppointments',
                component: () => import('@/pages/clients/ClientAppointmentsPage.vue'),
                meta: { title: 'Meus Agendamentos' }
            },
            {
                path: 'favorites',
                name: 'ClientFavorites',
                component: () => import('@/pages/clients/ClientFavoritesPage.vue'),
                meta: { title: 'Favoritos' }
            },
            {
                path: 'profile',
                name: 'ClientProfile',
                component: () => import('@/pages/clients/ClientProfilePage.vue'),
                meta: { title: 'Perfil' }
            }
        ]
    },

    // ==========================================
    // ROTA 404
    // ==========================================
    {
        path: '/:pathMatch(.*)*',
        redirect: '/'
    }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        } else {
            return { top: 0 };
        }
    },
});

// GUARDA DE NAVEGAÇÃO GLOBAL
router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();

    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    const requiredRole = to.matched.slice().reverse().find(record => record.meta.role)?.meta.role as string | undefined;

    const isAuthenticated = authStore.isAuthenticated;
    const userRole = authStore.user?.role;

    console.log('🔐 Router Guard:', {
        to: to.name,
        isAuthenticated,
        userRole,
        requiresAuth
    });

    // ==========================================
    // 1. REDIRECIONA USUÁRIOS JÁ AUTENTICADOS
    // ==========================================
    if (isAuthenticated && ['AccountType', 'Login', 'RegisterProvider'].includes(to.name as string)) {
        console.log('✅ Usuário autenticado acessando rota pública, redirecionando...');

        if (userRole === 'OWNER') {
            next({ name: 'Dashboard' });
            return;
        } else if (userRole === 'CLIENT') {
            next({ name: 'ClientDashboard' });
            return;
        }
    }

    // ==========================================
    // 2. VERIFICA ROTAS PROTEGIDAS
    // ==========================================
    if (requiresAuth) {
        if (!isAuthenticated) {
            console.log('❌ Não autenticado, redirecionando para Login');
            next({ name: 'Login', query: { redirect: to.fullPath } });
        } else {
            if (requiredRole) {
                if (userRole === requiredRole) {
                    console.log('✅ Role correta, permitindo acesso');
                    next();
                } else {
                    console.warn(`⚠️ Acesso negado: Rota requer '${requiredRole}', usuário tem '${userRole}'`);

                    // Redireciona para área correta
                    if (userRole === 'OWNER') {
                        next({ name: 'Dashboard' });
                    } else if (userRole === 'CLIENT') {
                        next({ name: 'ClientDashboard' });
                    } else {
                        next({ name: 'AccountType' });
                    }
                }
            } else {
                console.log('✅ Rota protegida sem role específica, permitindo acesso');
                next();
            }
        }
    } else {
        console.log('✅ Rota pública, permitindo acesso');
        next();
    }
});

export default router;