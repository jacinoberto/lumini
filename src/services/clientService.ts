import api from './api';

export interface Client {
    id: string;
    name: string;
    email: string;
    phone?: string;
    created_at?: string;

    // Estatísticas
    total_appointments?: number;
    total_spent?: number;
    notes?: string;
}

export interface ClientAppointmentHistory {
    id: string;
    service_name: string;
    service_price: number;
    start_time: string;
    status_id: number;
}

export interface UpdateClientNotesData {
    notes: string;
}

export const clientService = {
    /**
     * Lista todos os clientes de uma barbearia
     */
    async list(barbershopId: string, params?: {
        search?: string;
    }) {
        const response = await api.get(`/barbershops/${barbershopId}/clients`, { params });
        return response.data;
    },

    /**
     * Busca um cliente específico com detalhes
     */
    async getById(barbershopId: string, clientId: string) {
        const response = await api.get(`/barbershops/${barbershopId}/clients/${clientId}`);
        return response.data;
    },

    /**
     * Busca o histórico de agendamentos de um cliente
     */
    async getAppointmentHistory(barbershopId: string, clientId: string) {
        const response = await api.get(`/barbershops/${barbershopId}/clients/${clientId}/appointments`);
        return response.data;
    },

    /**
     * Atualiza as anotações de um cliente
     */
    async updateNotes(barbershopId: string, clientId: string, data: UpdateClientNotesData) {
        const response = await api.patch(`/barbershops/${barbershopId}/clients/${clientId}/notes`, data);
        return response.data;
    }
};