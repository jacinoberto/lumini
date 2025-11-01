import api from './api';

export interface BusinessHour {
    id: string;
    barbershop_id: string;
    day_of_week: number; // 0 = Domingo, 6 = Sábado
    start_time: string | null; // HH:mm:ss
    end_time: string | null; // HH:mm:ss
    is_active: boolean;
}

export interface UpdateBusinessHoursData {
    business_hours: Array<{
        day_of_week: number;
        start_time: string | null;
        end_time: string | null;
        is_active: boolean;
    }>;
}

export const businessHoursService = {
    /**
     * Busca os horários de funcionamento de uma barbearia
     */
    async get(barbershopId: string) {
        const response = await api.get(`/barbershops/${barbershopId}/business-hours`);
        return response.data;
    },

    /**
     * Atualiza os horários de funcionamento
     */
    async update(barbershopId: string, data: UpdateBusinessHoursData) {
        const response = await api.put(`/barbershops/${barbershopId}/business-hours`, data);
        return response.data;
    }
};