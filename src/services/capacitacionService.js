import api from '../api/axios';

export const getGrupoById = async (id) => {
    try {
        const res = await api.get(`/capacitacion/grupos/${id}`);
        return res.data;
    } catch (error) {
        console.error("Error al obtener el grupo con inscritos:", error);
        throw error;
    }
};

export const getGruposAbiertos = async (tipo = null) => {
    // Si tipo llega como "postulante", generamos el objeto { params: { tipo: "postulante" } }
    const config = tipo ? { params: { tipo } } : {};
    const response = await api.get('/capacitacion/grupos', config);
    return response.data;
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

// Renombramos a algo más genérico: asignarAGrupo
export const asignarCandidatosAGrupo = async (grupoId, ids, tipo = 'postulante') => {
    const res = await api.post('/capacitacion/grupos/asignar', {
        grupo_id: grupoId,
        ids: ids,      // Cambiamos 'postulante_ids' por 'ids' para que sea genérico
        tipo: tipo     // 'postulante' o 'preseleccion'
    });
    return res.data;
};

export const desvincularUsuarioDeGrupo = async (grupoId, usuarioId, tipo) => {
    const response = await api.post(`/capacitacion/grupos/${grupoId}/desvincular`, {
        usuario_id: usuarioId,
        tipo: tipo
    });
    return response.data;
};

export const deleteGrupo = async (id) => {
    const res = await api.delete(`/capacitacion/grupos/${id}`);
    return res.data;
};