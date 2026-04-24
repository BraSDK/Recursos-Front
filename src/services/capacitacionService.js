import api from '../api/axios';

export const getGruposAbiertos = async () => {
    const res = await api.get('/capacitacion/grupos');
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