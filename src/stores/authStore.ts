import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export type UserRole = 'CLIENT' | 'OWNER' | null;

interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    phone?: string;
    barbershop: {
        id: string | number;
        name: string;
    } | null;
}

export const useAuthStore = defineStore('auth', () => {
    // State
    const token = ref<string | null>(localStorage.getItem('authToken'));
    const user = ref<User | null>(null);
    const selectedRole = ref<UserRole>(localStorage.getItem('selectedRole') as UserRole);
    const barbershopId = ref<string | null>(localStorage.getItem('barbershopId'));

    // Computed
    const isAuthenticated = computed(() => !!token.value);
    const isOwner = computed(() => user.value?.role === 'OWNER');
    const isClient = computed(() => user.value?.role === 'CLIENT');

    // Actions
    function setSelectedRole(role: UserRole) {
        selectedRole.value = role;
        if (role) {
            localStorage.setItem('selectedRole', role);
        } else {
            localStorage.removeItem('selectedRole');
        }
    }

    function setAuth(authToken: string, userData: User, shopId?: string) {
        token.value = authToken;
        user.value = userData;

        localStorage.setItem('authToken', authToken);
        localStorage.setItem('userData', JSON.stringify(userData));

        if (shopId) {
            barbershopId.value = shopId;
            localStorage.setItem('barbershopId', shopId);
        }
    }

    function clearAuth() {
        token.value = null;
        user.value = null;
        barbershopId.value = null;

        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        localStorage.removeItem('barbershopId');
    }

    function loadUserFromStorage() {
        const storedUser = localStorage.getItem('userData');
        if (storedUser) {
            try {
                user.value = JSON.parse(storedUser);
            } catch (error) {
                console.error('Erro ao carregar dados do usuário:', error);
                clearAuth();
            }
        }
    }

    function clearSelectedRole() {
        selectedRole.value = null;
        localStorage.removeItem('selectedRole');
    }

    // Initialize
    loadUserFromStorage();

    return {
        token,
        user,
        selectedRole,
        barbershopId,
        isAuthenticated,
        isOwner,
        isClient,
        setSelectedRole,
        setAuth,
        clearAuth,
        loadUserFromStorage,
        clearSelectedRole,
    };
});