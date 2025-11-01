import api from './api';

export interface BarbershopFilters {
    category?: 'all' | 'nearby' | 'top-rated';
    latitude?: number;
    longitude?: number;
    radius?: number;
    search?: string;
    page?: number;
}

export interface UpdateBarbershopData {
    name?: string;
    company_code?: string;
    biography?: string;
    phone?: string;
    requires_prepayment?: boolean;
    address?: {
        zip_code: string;
        street: string;
        number: string;
        complement?: string;
        neighborhood: string;
        city: string;
        state: string;
    };
}

export const barbershopService = {
    /**
     * Listar barbearias
     */
    async list(filters: BarbershopFilters = {}) {
        const response = await api.get('/barbershops', { params: filters });
        return response.data;
    },

    /**
     * Buscar barbearias
     */
    async search(query: string, latitude?: number, longitude?: number) {
        const response = await api.get('/barbershops/search', {
            params: { query, latitude, longitude }
        });
        return response.data;
    },

    /**
     * Detalhes de uma barbearia
     */
    async show(id: string) {
        const response = await api.get(`/barbershops/${id}`);
        return response.data;
    },

    /**
     * Horários disponíveis
     */
    async availableSlots(barbershopId: string, date: string, barberId: string) {
        const response = await api.get(`/barbershops/${barbershopId}/available-slots`, {
            params: { date, barber_id: barberId }
        });
        return response.data;
    },

    /**
     * Atualiza os dados da barbearia (onboarding ou perfil)
     */
    async update(barbershopId: string, data: UpdateBarbershopData) {
        const response = await api.put(`/barbershops/${barbershopId}`, data);
        return response.data;
    },

    /**
     * Upload de logo da barbearia
     */
    async uploadLogo(barbershopId: string, file: File) {
        const formData = new FormData();
        formData.append('logo', file);

        const response = await api.post(
            `/barbershops/${barbershopId}/logo`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        return response.data;
    },

    /**
     * Upload de capa da barbearia
     */
    async uploadCover(barbershopId: string, file: File) {
        const formData = new FormData();
        formData.append('cover', file);

        const response = await api.post(
            `/barbershops/${barbershopId}/cover`,
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