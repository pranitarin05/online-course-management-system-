import axiosInstance from './axiosInstance';

export const login = (username, password) =>
    axiosInstance.post('/api/token/', { username, password });

export const refreshToken = (refresh) =>
    axiosInstance.post('/api/token/refresh/', { refresh });
