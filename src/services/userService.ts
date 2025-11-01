// src/services/userService.ts

import api from './api';

export const userService = {
    async getProfile() {
        const response = await api.get('/client/profile');
        return response.data;
    },

    async updateProfile(data: any) {
        const response = await api.put('/client/profile', data);
        return response.data;
    },

    async updateAvatar(file: File) {
        const formData = new FormData();
        formData.append('avatar', file);
        const response = await api.post('/client/profile/avatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    async changePassword(data: { current_password: string; new_password: string; new_password_confirmation: string }) {
        const response = await api.put('/client/profile/password', data);
        return response.data;
    },

    async getStats() {
        const response = await api.get('/client/profile/stats');
        return response.data;
    }
};