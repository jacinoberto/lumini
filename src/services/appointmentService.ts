import api from './api';

export interface Appointment {
    id: string;
    barbershop_id: string;
    client_id: string;
    barber_id: string;
    service_id: string;
    status_id: number;
    start_time: string; // ISO 8601 timestamp
    end_time: string; // ISO 8601 timestamp
    created_at?: string;
    updated_at?: string;

    // Relacionamentos (se a API retornar)
    client?: {
        id: string;
        name: string;
        email: string;
        phone?: string;
    };
    barber?: {
        id: string;
        name: string;
        specialties?: string;
    };
    service?: {
        id: string;
        name: string;
        price: number;
        duration_minutes: number;
    };
    status?: {
        id: number;
        name: string;
    };
}

export interface CreateAppointmentData {
    client_id: string;
    barber_id: string;
    service_id: string;
    start_time: string; // ISO 8601
    end_time: string; // ISO 8601
    status_id?: number;
}

export interface UpdateAppointmentData extends Partial<CreateAppointmentData> {
    id: string;
}

export interface UpdateAppointmentStatusData {
    status_id: number;
}

export const appointmentService = {
    /**
     * Lista todos os agendamentos de uma barbearia
     * Pode filtrar por data, status, etc
     */
    async list(barbershopId: string, params?: {
        date?: string; // YYYY-MM-DD
        status_id?: number;
        barber_id?: string;
    }) {
        const response = await api.get(`/barbershops/${barbershopId}/appointments`, { params });
        return response.data;
    },

    /**
     * Busca um agendamento específico por ID
     */
    async getById(barbershopId: string, appointmentId: string) {
        const response = await api.get(`/barbershops/${barbershopId}/appointments/${appointmentId}`);
        return response.data;
    },

    /**
     * Cria um novo agendamento
     */
    async create(barbershopId: string, data: CreateAppointmentData) {
        const response = await api.post(`/barbershops/${barbershopId}/appointments`, data);
        return response.data;
    },

    /**
     * Atualiza um agendamento existente
     */
    async update(barbershopId: string, appointmentId: string, data: UpdateAppointmentData) {
        const response = await api.put(`/barbershops/${barbershopId}/appointments/${appointmentId}`, data);
        return response.data;
    },

    /**
     * Atualiza apenas o status de um agendamento
     */
    async updateStatus(barbershopId: string, appointmentId: string, data: UpdateAppointmentStatusData) {
        const response = await api.patch(`/barbershops/${barbershopId}/appointments/${appointmentId}/status`, data);
        return response.data;
    },

    /**
     * Deleta um agendamento
     */
    async delete(barbershopId: string, appointmentId: string) {
        const response = await api.delete(`/barbershops/${barbershopId}/appointments/${appointmentId}`);
        return response.data;
    }
};