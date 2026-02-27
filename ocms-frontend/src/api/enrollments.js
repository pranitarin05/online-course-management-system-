import axiosInstance from './axiosInstance';

export const getEnrollments = (params = {}) =>
    axiosInstance.get('/enrollments/', { params });

export const getEnrollment = (id) =>
    axiosInstance.get(`/enrollments/${id}/`);

export const createEnrollment = (data) =>
    axiosInstance.post('/enrollments/', data);

export const deleteEnrollment = (id) =>
    axiosInstance.delete(`/enrollments/${id}/`);
