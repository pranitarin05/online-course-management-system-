import axiosInstance from './axiosInstance';

export const getReviews = (params = {}) =>
    axiosInstance.get('/reviews/', { params });

export const getReview = (id) =>
    axiosInstance.get(`/reviews/${id}/`);

export const createReview = (data) =>
    axiosInstance.post('/reviews/', data);

export const updateReview = (id, data) =>
    axiosInstance.put(`/reviews/${id}/`, data);

export const deleteReview = (id) =>
    axiosInstance.delete(`/reviews/${id}/`);
