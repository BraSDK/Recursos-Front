import api from '../api/axios';

export const getPreSelecciones = async ({ estado, page, search }) => {
    const response = await api.get('/pre-selecciones', {
        params: { estado, page, search }
    });
    return response.data;
};

export const createPreSeleccion = async (datos) => {
    const response = await api.post('/pre-selecciones', datos);
    return response.data;
};

export const updatePreSeleccion = async (id, datos) => {
    const response = await api.put(`/pre-selecciones/${id}`, datos);
    return response.data;
};

// Nueva ruta pública para el validador
export const verificarDniPublico = async (dni) => {
    const response = await api.get(`/public/verificar-dni/${dni}`);
    return response.data;
};

export const deletePreSeleccion = async (id) => {
    const response = await api.delete(`/pre-selecciones/${id}`);
    return response.data;
};