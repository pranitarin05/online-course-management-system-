import axiosInstance from './axiosInstance';

export const getCourses = (params = {}) =>
    axiosInstance.get('/courses/', { params });

export const getCourse = (id) =>
    axiosInstance.get(`/courses/${id}/`);

export const createCourse = (data) =>
    axiosInstance.post('/courses/', data);

export const updateCourse = (id, data) =>
    axiosInstance.put(`/courses/${id}/`, data);

export const patchCourse = (id, data) =>
    axiosInstance.patch(`/courses/${id}/`, data);

export const deleteCourse = (id) =>
    axiosInstance.delete(`/courses/${id}/`);
