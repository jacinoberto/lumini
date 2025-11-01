import api from './api';

export interface WorkingHour {
    id: string;
    barbershop_id: string;
    day_of_week: number; // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
    is_active: boolean; // CORRIGIDO: is_active ao invés de is_open
    start_time: string; // formato "HH:MM:SS"
    end_time: string; // formato "HH:MM:SS"
    created_at?: string;
    updated_at?: string;
}

export interface CreateWorkingHourData {
    day_of_week: number;
    is_active: boolean; // CORRIGIDO
    start_time: string;
    end_time: string;
}

export interface UpdateWorkingHourData extends CreateWorkingHourData {
    id: string;
}

export const workingHourService = {
    /**
     * Lista todos os horários de funcionamento de uma barbearia
     */
    async list(barbershopId: string) {
        const response = await api.get(`/barbershops/${barbershopId}/business-hours`);
        return response.data;
    },

    /**
     * Cria um novo horário de funcionamento
     */
    async create(barbershopId: string, data: CreateWorkingHourData) {
        const response = await api.post(`/barbershops/${barbershopId}/business-hours`, data);
        return response.data;
    },

    /**
     * Atualiza um horário de funcionamento existente
     */
    async update(barbershopId: string, workingHourId: string, data: UpdateWorkingHourData) {
        const response = await api.put(`/barbershops/${barbershopId}/business-hours/${workingHourId}`, data);
        return response.data;
    },

    /**
     * Deleta um horário de funcionamento (opcional)
     */
    async delete(barbershopId: string, workingHourId: string) {
        const response = await api.delete(`/barbershops/${barbershopId}/business-hours/${workingHourId}`);
        return response.data;
    }
};