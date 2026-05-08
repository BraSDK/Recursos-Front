import api from '../api/axios';

export const getGruposAbiertos = async () => {
    const res = await api.get('/capacitacion/grupos');
    return res.data;
};

export const getEventosCalendario = async () => {
    try {
        const response = await api.get('/capacitacion/grupos/calendario');
        return response.data;
    } catch (error) {
        console.error("Error al obtener eventos del calendario", error);
        throw error;
    }
};

export const updateGrupo = async (id, datos) => {
    const res = await api.put(`/capacitacion/grupos/${id}`, datos);
    return res.data;
};

export const getGruposFiltrados = async (filtros) => {
    const res = await api.get('/capacitacion/grupos', { params: filtros });
    return res.data;
};

export const crearGrupo = async (datos) => {
    const res = await api.post('/capacitacion/grupos', datos);
    return res.data;
};

export const asignarPostulantesAGrupo = async (grupoId, postulanteIds) => {
    const res = await api.post('/capacitacion/grupos/asignar', {
        grupo_id: grupoId,
        postulante_ids: postulanteIds
    });
    return res.data;
};

export const deleteGrupo = async (id) => {
    const res = await api.delete(`/capacitacion/grupos/${id}`);
    return res.data;
};