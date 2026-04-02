export const obtenerEstadoDia = (postulante, numDia) => {
    if (!postulante.procesos_seleccion) return 'pendiente';
  
    const etapaBuscada = `${numDia}° Día de Capa`;
    const registro = postulante.procesos_seleccion.find(p => p.etapa === etapaBuscada);
  
    if (!registro) return 'pendiente';
    return registro.resultado === 'aprobado' ? 'asistio' : 'falto';
  };