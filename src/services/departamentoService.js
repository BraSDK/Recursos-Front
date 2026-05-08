import api from '../api/axios';

export const getDepartamentos = async (params = {}) => {
    const response = await api.get('/departamentos', { params });
    return response.data;
};

export const createDepartamento = async (datos) => {
    const response = await api.post('/departamentos', datos);
    return response.data;
};

export const updateDepartamento = async (id, datos) => {
    const response = await api.put(`/departamentos/${id}`, datos);
    return response.data;
};

export const deleteDepartamento = async (id) => {
    const response = await api.delete(`/departamentos/${id}`);
    return response.data;
};
