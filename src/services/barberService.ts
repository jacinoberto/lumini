import api from './api';

export interface Barber {
    id: string;
    barbershop_id: string;
    name: string;
    profile_image_url: string | null;
    specialties: string | null;
    is_active: boolean;
    order: number;
    created_at: string;
    updated_at: string;
    rating_average: number | null;
    rating_count: number | null;
}

export interface CreateBarberData {
    name: string;
    specialties?: string;
    profile_image_url?: string | undefined;
    is_active?: boolean;
}

export interface UpdateBarberData {
    name?: string;
    specialties?: string;
    profile_image_url?: string;
    is_active?: boolean;
}

export const barberService = {
    /**
     * Lista todos os barbeiros de uma barbearia
     */
    async list(barbershopId: string) {
        const response = await api.get(`/barbershops/${barbershopId}/barbers`);
        return response.data;
    },

    /**
     * Cria um novo barbeiro
     */
    async create(barbershopId: string, data: CreateBarberData) {
        const response = await api.post(`/barbershops/${barbershopId}/barbers`, data);
        return response.data;
    },

    /**
     * Atualiza um barbeiro existente
     */
    async update(barbershopId: string, barberId: string, data: UpdateBarberData) {
        const response = await api.put(`/barbershops/${barbershopId}/barbers/${barberId}`, data);
        return response.data;
    },

    /**
     * Deleta um barbeiro (desativa)
     */
    async delete(barbershopId: string, barberId: string) {
        const response = await api.delete(`/barbershops/${barbershopId}/barbers/${barberId}`);
        return response.data;
    },

    /**
     * Upload de foto do barbeiro
     */
    async uploadPhoto(barbershopId: string, barberId: string, file: File) {
        const formData = new FormData();
        formData.append('profile_image', file);

        const response = await api.post(
            `/barbershops/${barbershopId}/barbers/${barberId}/photo`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        return response.data;
    }
};