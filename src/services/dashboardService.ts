import api from './api';

export interface DashboardStats {
    today_appointments: number;
    monthly_revenue: number;
    average_rating: number;
    rating_count: number;
}

export interface TodayAppointment {
    id: string;
    time: string;
    client_name: string;
    service_name: string;
    barber_name: string;
    status_id: number;
}

export const dashboardService = {
    /**
     * Busca estatísticas do dashboard
     */
    async getStats(barbershopId: string) {
        const response = await api.get(`/barbershops/${barbershopId}/dashboard/stats`);
        return response.data;
    },

    /**
     * Busca agendamentos de hoje
     */
    async getTodayAppointments(barbershopId: string) {
        const response = await api.get(`/barbershops/${barbershopId}/dashboard/today`);
        return response.data;
    }
};