import api from '../api/axios';

export const getPuestos = async () => {
    const response = await api.get('/puestos');
    return response.data;
};

export const createPuesto = async (datos) => {
    const response = await api.post('/puestos', datos);
    return response.data;
};

export const updatePuesto = async (id, datos) => {
    const response = await api.put(`/puestos/${id}`, datos);
    return response.data;
};

export const deletePuesto = async (id) => {
    const response = await api.delete(`/puestos/${id}`);
    return response.data;
};