import api from '../api/axios';

export const getEmpleados = async () => {
    const response = await api.get('/empleados');
    return response.data;
};

export const createEmpleado = async (datos) => {
    const response = await api.post('/empleados', datos);
    return response.data;
};

export const updateEmpleado = async (id, datos) => {
    const response = await api.put(`/empleados/${id}`, datos);
    return response.data;
};

export const cesarEmpleado = async (id, datosCese) => {
    // Cambiamos el DELETE por un POST al endpoint de cese
    const response = await api.post(`/empleados/${id}/cesar`, datosCese);
    return response.data;
};

export const deleteEmpleado = async (id) => {
    const response = await api.delete(`/empleados/${id}`);
    return response.data;
};