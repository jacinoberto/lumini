// src/services/favoriteService.ts

import api from './api';

export const favoriteService = {
    async list() {
        const response = await api.get('/client/favorites');
        return response.data;
    },

    async add(barbershopId: string) {
        const response = await api.post('/client/favorites', {
            barbershop_id: barbershopId
        });
        return response.data;
    },

    async remove(barbershopId: string) {
        const response = await api.delete(`/client/favorites/${barbershopId}`);
        return response.data;
    },

    /**
     * Verificar se está favoritado
     */
    async check(barbershopId: string) {
        const response = await api.get(`/client/favorites/${barbershopId}/check`);
        return response.data;
    },
};