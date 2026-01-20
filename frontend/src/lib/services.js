import api from './api';

export const authService = {
    login: async (username, password) => {
        const response = await api.post('auth/login/', { username, password });
        return response.data;
    },
    register: async (username, email, password) => {
        const response = await api.post('auth/register/', { username, email, password });
        return response.data;
    },
    getProfile: async () => {
        const response = await api.get('auth/profile/');
        return response.data;
    },
    updateProfile: async (userData) => {
        const response = await api.patch('auth/profile/', userData);
        return response.data;
    },
};

export const routineService = {
    getAll: async () => {
        const response = await api.get('routines/');
        return response.data;
    },
    getLogs: async () => {
        const response = await api.get('routines/logs/');
        return response.data;
    },
    create: async (routineData) => {
        const response = await api.post('routines/', routineData);
        return response.data;
    },
    update: async (id, routineData) => {
        const response = await api.patch(`routines/${id}/`, routineData);
        return response.data;
    },
    delete: async (id) => {
        const response = await api.delete(`routines/${id}/`);
        return response.data;
    },
    deleteAll: async () => {
        const response = await api.delete('routines/delete_all/');
        return response.data;
    },
    resetHistory: async () => {
        const response = await api.post('routines/reset_history/');
        return response.data;
    },
    toggleLog: async (id, date) => {
        const response = await api.post(`routines/${id}/log/`, { date });
        return response.data;
    },
};
