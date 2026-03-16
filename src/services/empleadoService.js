import api from '../api/axios';

export const getEmpleados = async () => {
    const response = await api.get('/empleados');
    return response.data;
};

// ... (tus otras funciones)
export const createEmpleado = async (datos) => {
    const response = await api.post('/empleados', datos);
    return response.data;
};

// src/services/empleadoService.js
export const updateEmpleado = async (id, datos) => {
    const response = await api.put(`/empleados/${id}`, datos);
    return response.data;
};

// Añadimos esta función:
export const deleteEmpleado = async (id) => {
    const response = await api.delete(`/empleados/${id}`);
    return response.data;
};