import api from '../api/axios';

export const getEmpleados = async () => {
    const response = await api.get('/empleados');
    return response.data;
};

// Añadimos esta función:
export const deleteEmpleado = async (id) => {
    const response = await api.delete(`/empleados/${id}`);
    return response.data;
};