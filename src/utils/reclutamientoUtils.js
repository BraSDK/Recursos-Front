export const obtenerEstadoDia = (postulante, numDia) => {
  if (!postulante.procesos_seleccion) return 'pendiente';

  const etapaBuscada = `${numDia}° Día de Capa`;
  const registro = postulante.procesos_seleccion.find(p => p.etapa === etapaBuscada);

  // Si no existe el registro en la DB, está pendiente
  if (!registro) return 'pendiente';

  // Si existe, evaluamos el resultado específico
  if (registro.resultado === 'aprobado') {
      return 'asistio';
  } 
  
  if (registro.resultado === 'desaprobado') {
      return 'falto';
  }

  // Si el resultado es 'pendiente' (como el que vimos en tu consola), 
  // retorna 'pendiente' para que no se pinte de rojo.
  return 'pendiente';
};