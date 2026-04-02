import api from '../api/axios';

export const registrarPostulacion = async (datos) => {
    // Creamos un objeto FormData para poder enviar archivos (la foto)
    const formData = new FormData();

    // Recorremos todos los campos del formulario
    Object.keys(datos).forEach(key => {
        if (key === 'formacion_academica' || key === 'experiencia_laboral') {
            // Los arrays deben enviarse como string JSON para que el Service de Laravel los decodifique
            formData.append(key, JSON.stringify(datos[key]));
        } else if (key === 'foto' && datos[key] instanceof File) {
            // Si hay una foto y es un archivo real
            formData.append('foto', datos[key]);
        } else {
            // Campos normales (DNI, nombres, etc.)
            formData.append(key, datos[key]);
        }
    });

    const response = await api.post('/public/postular', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    
    return response.data;
};

// Esta función la usará el reclutador en el panel administrativo
export const getPostulantes = async () => {
    const response = await api.get('/postulantes');
    return response.data;
};

export const actualizarAsistencia = async (id, numDia, esAsistencia) => {
    // estado puede ser: 'asistio', 'falto' o 'pendiente'
    const response = await api.put(`/postulantes/${id}/asistencia`, {
        num_dia: numDia,
        asistencia: esAsistencia
    });
    return response.data;
};

export const anularAsistencia = async (id, numDia) => {
    const response = await api.delete(`/postulantes/${id}/asistencia`, {
        data: { num_dia: numDia } // En axios DELETE, el body va en 'data'
    });
    return response.data;
};