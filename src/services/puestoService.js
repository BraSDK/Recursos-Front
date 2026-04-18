import api from '../api/axios';

export const getPuestos = async (params = {}) => {
    const response = await api.get('/puestos', { params });
    return response.data;
};

export const getPuestosPorDepartamento = async (departamentoId) => {
    const response = await api.get(`/puestos/departamento/${departamentoId}`);
    return response.data;
};

export const createPuesto = async (datos) => {
    const response = await api.post('/puestos', datos);
    return response.data;
};

export const updatePuesto = async (id, datos) => {
    // Esto llamará a: PUT /api/puestos/{id}
    const response = await api.put(`/puestos/${id}`, datos);
    return response.data;
};

export const deletePuesto = async (id) => {
    // Esto llamará a: DELETE /api/puestos/{id}
    const response = await api.get(`/puestos/${id}`); // REVISIÓN: Debería ser api.delete
    const res = await api.delete(`/puestos/${id}`);
    return res.data;
};