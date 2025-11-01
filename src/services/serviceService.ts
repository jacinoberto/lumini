// src/services/serviceService.ts

import api from './api';

export interface Service {
    id: string;
    barbershop_id: string;
    name: string;
    description?: string;
    price: number;
    duration_minutes: number;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface CreateServiceData {
    name: string;
    description?: string;
    price: number;
    duration_minutes: number;
    is_active: boolean;
}

export interface UpdateServiceData extends CreateServiceData {
    id: string;
}

export const serviceService = {
    /**
     * Lista todos os serviços de uma barbearia
     */
    async list(barbershopId: string) {
        const response = await api.get(`/barbershops/${barbershopId}/services`);
        return response.data;
    },

    /**
     * Busca um serviço específico por ID
     */
    async getById(barbershopId: string, serviceId: string) {
        const response = await api.get(`/barbershops/${barbershopId}/services/${serviceId}`);
        return response.data;
    },

    /**
     * Cria um novo serviço
     */
    async create(barbershopId: string, data: CreateServiceData) {
        const response = await api.post(`/barbershops/${barbershopId}/services`, data);
        return response.data;
    },

    /**
     * Atualiza um serviço existente
     */
    async update(barbershopId: string, serviceId: string, data: UpdateServiceData) {
        const response = await api.put(`/barbershops/${barbershopId}/services/${serviceId}`, data);
        return response.data;
    },

    /**
     * Deleta um serviço
     */
    async delete(barbershopId: string, serviceId: string) {
        const response = await api.delete(`/barbershops/${barbershopId}/services/${serviceId}`);
        return response.data;
    }
};