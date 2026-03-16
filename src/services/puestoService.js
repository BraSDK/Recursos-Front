import api from '../api/axios';

export const getPuestos = async () => {
    const response = await api.get('/puestos');
    return response.data;
};