import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '@/services/api'; // Importamos o Axios
import type { User, UserRole } from '@/types/user'; // Importe seus tipos

// Garantia de que os tipos estão corretos (ajuste se necessário)
// interface User {
//     id: string | number;
//     name: string;
//     email: string;
//     role: UserRole;
//     barbershop: {
//         id: string | number;
//         name: string;
//     } | null;
// }
// type UserRole = 'CLIENT' | 'OWNER' | null;


export const useAuthStore = defineStore('auth', () => {

    // --- STATE ---

    // 1. Carrega os dados persistidos do localStorage
    const token = ref<string | null>(localStorage.getItem('authToken'));
    const storedUser = localStorage.getItem('userData');
    const user = ref<User | null>(storedUser ? JSON.parse(storedUser) as User : null);

    // 2. Usamos sessionStorage para o pré-login (mais volátil)
    const selectedRole = ref<UserRole>(sessionStorage.getItem('selectedRole') as UserRole);


    // --- AÇÃO DE INICIALIZAÇÃO (HIDRATAÇÃO DO AXIOS) ---

    // 3. Se um token foi carregado, configure o Axios imediatamente
    if (token.value) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;
    }


    // --- COMPUTED ---

    const isAuthenticated = computed(() => !!token.value);
    const isOwner = computed(() => user.value?.role === 'OWNER');
    const isClient = computed(() => user.value?.role === 'CLIENT');

    // 4. barbershopId é agora uma fonte de verdade única, derivada do usuário
    const barbershopId = computed<string | null>(() => {
        if (user.value && user.value.role === 'OWNER' && user.value.barbershop) {
            return String(user.value.barbershop.id); // Garante que é string
        }
        return null;
    });


    // --- ACTIONS ---

    function setSelectedRole(role: UserRole) {
        selectedRole.value = role;
        if (role) {
            sessionStorage.setItem('selectedRole', role); // Usando sessionStorage
        } else {
            sessionStorage.removeItem('selectedRole');
        }
    }

    // 5. setAuth agora é mais simples e configura o Axios
    function setAuth(authToken: string, userData: User) {
        token.value = authToken;
        user.value = userData; // O computed 'barbershopId' vai reagir a esta mudança

        localStorage.setItem('authToken', authToken);
        localStorage.setItem('userData', JSON.stringify(userData));
        // Não precisamos mais salvar o barbershopId separadamente

        // Configura o header do Axios para requisições futuras
        api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
    }

    // 6. clearAuth agora limpa o header do Axios
    function clearAuth() {
        token.value = null;
        user.value = null;
        // O computed 'barbershopId' reagirá a 'user.value = null'

        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        localStorage.removeItem('barbershopId'); // Limpa a versão antiga por segurança

        // Remove o header do Axios
        delete api.defaults.headers.common['Authorization'];
    }

    function clearSelectedRole() {
        selectedRole.value = null;
        sessionStorage.removeItem('selectedRole');
    }

    // 7. loadUserFromStorage não é mais necessária,
    //    pois a lógica já está no topo da store (inicialização)

    return {
        token,
        user,
        selectedRole,
        barbershopId, // A nova computed
        isAuthenticated,
        isOwner,
        isClient,
        setSelectedRole,
        setAuth,
        clearAuth,
        clearSelectedRole,
    };
});