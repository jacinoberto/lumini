import api from './api';

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    phone?: string;
}

export interface AuthResponse {
    token: string;
    user: {
        id: string;
        name: string;
        email: string;
        role: string;
    };
}

export const authService = {
    /**
     * Login
     */
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await api.post('/login', credentials);
        return response.data;
    },

    /**
     * Registro de Cliente
     */
    async registerClient(data: RegisterData): Promise<AuthResponse> {
        const response = await api.post('/register/client', data);
        return response.data;
    },

    /**
     * Registro de Owner (Barbeiro)
     */
    async registerOwner(data: RegisterData): Promise<AuthResponse> {
        const response = await api.post('/register/owner', data);
        return response.data;
    },

    /**
     * Logout
     */
    async logout(): Promise<void> {
        await api.post('/logout');
    },

    /**
     * Buscar usuário autenticado
     */
    async me(): Promise<any> {
        const response = await api.get('/me');
        return response.data;
    },
};