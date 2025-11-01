// src/services/dashboardService.ts (ATUALIZADO)

import api from './api';

export interface DashboardStats {
    appointments_today: number;
    revenue_month: number;
    rating_average: number;
}

export interface TodayAppointment {
    id: string;
    client_name: string;
    service_name: string;
    barber_name: string;
    appointment_date: string;
    start_time: string;
    status: string;
    client_profile_image?: string;
}

export const dashboardService = {
    /**
     * Busca estatísticas do dashboard
     * Por enquanto retorna dados mockados até implementar no backend
     */
    async getStats(barbershopId: string) {
        // TODO: Implementar endpoint no backend
        // const response = await api.get(`/barbershops/${barbershopId}/dashboard/stats`);
        // return response.data;

        // Dados mockados temporários
        return {
            data: {
                appointments_today: 12,
                revenue_month: 8400,
                rating_average: 4.9
            }
        };
    },

    /**
     * Busca agendamentos de hoje
     * Por enquanto retorna dados mockados até implementar no backend
     */
    async getTodayAppointments(barbershopId: string) {
        // TODO: Implementar endpoint no backend
        // const response = await api.get(`/barbershops/${barbershopId}/dashboard/today-appointments`);
        // return response.data;

        // Dados mockados temporários
        return {
            data: [
                {
                    id: '1',
                    client_name: 'Jonas Nascimento',
                    service_name: 'Corte + Barba',
                    barber_name: 'João',
                    appointment_date: new Date().toISOString(),
                    start_time: '14:00:00',
                    status: 'confirmed'
                },
                {
                    id: '2',
                    client_name: 'Carlos Andrade',
                    service_name: 'Mullet',
                    barber_name: 'Pedro',
                    appointment_date: new Date().toISOString(),
                    start_time: '15:30:00',
                    status: 'confirmed'
                },
                {
                    id: '3',
                    client_name: 'Maria Clara',
                    service_name: 'Corte Feminino',
                    barber_name: 'Ana',
                    appointment_date: new Date().toISOString(),
                    start_time: '17:00:00',
                    status: 'confirmed'
                }
            ]
        };
    }
};