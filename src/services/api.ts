import axios, { type AxiosInstance, type AxiosError } from 'axios';
import { useAuthStore } from '@/stores/authStore';
import router from '@/router';

// Configuração base da API
const api: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://api-lumini.onrender.com/api',
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Interceptor de Request - Adiciona token
api.interceptors.request.use(
    (config) => {
        const authStore = useAuthStore();

        if (authStore.token) {
            config.headers.Authorization = `Bearer ${authStore.token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor de Response - Trata erros
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error: AxiosError) => {
        const authStore = useAuthStore();

        // Token expirado ou inválido
        if (error.response?.status === 401) {
            authStore.clearAuth();
            router.push({ name: 'Login' });
        }

        // Erro de servidor
        if (error.response?.status === 500) {
            console.error('Erro no servidor:', error);
        }

        return Promise.reject(error);
    }
);

export default api;