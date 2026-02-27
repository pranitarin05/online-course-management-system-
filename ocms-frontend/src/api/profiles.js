import axiosInstance from './axiosInstance';

export const getProfiles = (params = {}) =>
    axiosInstance.get('/accounts/', { params });

export const getProfile = (id) =>
    axiosInstance.get(`/accounts/${id}/`);

export const createProfile = (data) =>
    axiosInstance.post('/accounts/', data);

export const updateProfile = (id, data) =>
    axiosInstance.put(`/accounts/${id}/`, data);

export const deleteProfile = (id) =>
    axiosInstance.delete(`/accounts/${id}/`);
