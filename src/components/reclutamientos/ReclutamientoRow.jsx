import { CheckCircle2, XCircle, Eye, Edit } from 'lucide-react';
import { obtenerEstadoDia } from '@/utils/reclutamientoUtils';
import { estadoColors, turnoColors, configuracionAreas } from '@/constants/reclutamiento';

const formatFecha = (fecha) => {
  if (!fecha) return '-';
  const d = new Date(fecha);
  return d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short' });
};

const ReclutamientoRow = ({ post, index, areaPostulante, diasCapacitacion, onAsistencia, onOpenDetalle, onOpenEdit, isSelected, onToggleSelect }) => {

  // Pintamos 4 columnas siempre para mantener la estructura de la tabla
  const columnasTabla = [1, 2, 3, 4];
  
  // Obtenemos cuántos días le corresponden a ESTE postulante según SU área
  const config = configuracionAreas[areaPostulante] || configuracionAreas['ventas'];
  const diasPermitidos = config.dias_capacitacion;

  const fechaFin = post.estado_proceso === 'no_apto' || post.estado_proceso === 'gestion' 
    ? post.updated_at 
    : null;

  // Informacion del turno para mostrar etiqueta y color
  const obtenerInfoTurno = (horarioCompleto) => {
    if (!horarioCompleto) return { etiqueta: 'S.I', color: 'bg-gray-50 text-gray-400' };
    
    const h = horarioCompleto.toLowerCase();
    if (h.includes('mañana')) return { etiqueta: 'Mañana', clase: turnoColors.Mañana };
    if (h.includes('tarde')) return { etiqueta: 'Tarde', clase: turnoColors.Tarde };
    if (h.includes('noche')) return { etiqueta: 'Noche', clase: turnoColors.Noche };
    
    return { etiqueta: 'Otro', clase: 'bg-gray-50 text-gray-500' };
  };

  const turnoInfo = obtenerInfoTurno(post.horario_interes);

  return (
    <tr className={`transition-colors ${isSelected ? 'bg-indigo-50/30' : 'hover:bg-gray-50'} ${post.estado_proceso === 'no_apto' ? 'bg-red-50/20' : ''}`}>
      
      {/* Checkbox de selección */}
      <td className="px-4 py-4 text-center">
        <input 
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect([post.id])}
          className="rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
        />
      </td>

      {/* N° */}
      <td className="px-4 py-4 text-center text-xs font-medium text-gray-400">
        {index + 1}
      </td>

      {/* FECHA DE REGISTRO */}
      <td className="px-4 py-4">
        <div className="flex flex-col">
          <span className="text-[11px] font-bold text-gray-700">
            {formatFecha(post.created_at)}
          </span>
          <span className="text-[9px] text-gray-400 uppercase">Ingreso</span>
        </div>
      </td>

      {/* FECHA DE CIERRE (SALIDA O PASE) */}
      <td className="px-4 py-4">
        <div className="flex flex-col">
          <span className={`text-[11px] font-bold ${post.estado_proceso === 'no_apto' ? 'text-red-500' : 'text-green-600'}`}>
            {formatFecha(fechaFin)}
          </span>
          <span className="text-[9px] text-gray-400 uppercase">Final</span>
        </div>
      </td>

      {/* Postulante */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs uppercase shadow-sm">
            {post.nombres.charAt(0)}{post.apellido_paterno.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-gray-900 leading-none mb-1">
              {post.nombres} {post.apellido_paterno}
            </span>
            {post.es_reingreso && (
              <span className="text-[9px] text-orange-600 font-black uppercase italic tracking-tighter">
                ⚠️ Reingreso
              </span>
            )}
          </div>
        </div>
      </td>

      {/* Estado */}
      <td className="px-6 py-4">
        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase shadow-sm ${estadoColors[post.estado_proceso] || 'bg-gray-50'}`}>
          {post.estado_proceso}
        </span>
      </td>

      {/* DNI */}
      <td className="px-6 py-4">
        <span className="text-sm font-mono text-gray-600 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
          {post.dni}
        </span>
      </td>

      {/* Turno */}
      <td className="px-6 py-4 text-center">
        <span 
          title={post.horario_interes} // <--- Esto hace que aparezca el horario al pasar el mouse
          className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase cursor-help transition-all hover:brightness-95 ${turnoInfo.clase}`}
        >
          {turnoInfo.etiqueta}
        </span>
      </td>

      {/* DÍAS DINÁMICOS: Usamos columnasTabla.map para que nunca falten celdas */}
      {columnasTabla.map(dia => {
        const estadoReal = obtenerEstadoDia(post, dia);
        const esDiaInvalido = dia > diasPermitidos;
        const diaAnteriorEstado = dia > 1 ? obtenerEstadoDia(post, dia - 1) : 'asistio';
        const estaBloqueado = esDiaInvalido || diaAnteriorEstado !== 'asistio';

        return (
          <td key={dia} className="px-6 py-4 text-center">
            {esDiaInvalido ? (
              <span className="text-gray-200 font-bold">-</span>
            ) : (
              <button 
                disabled={estaBloqueado}
                onClick={(e) => onAsistencia(e, post, dia)}
                className={`transition-all transform p-1 rounded-full 
                  ${estaBloqueado ? 'opacity-20 cursor-not-allowed' : 'active:scale-90 hover:bg-indigo-50'}
                  ${estadoReal === 'asistio' ? 'text-green-500' : 
                    estadoReal === 'falto' ? 'text-red-500' : 
                    'text-gray-200 hover:text-indigo-500'}`}
                title={esDiaInvalido ? "No aplica" : (estaBloqueado ? "Pendiente" : `Día ${dia}`)}
              >
                {estadoReal === 'falto' ? <XCircle size={24} /> : <CheckCircle2 size={24} />}
              </button>
            )}
          </td>
        );
      })}

      {/* Acciones - Columna Final */}
      <td className="px-6 py-4">
        <div className="flex items-center justify-end gap-2 min-w-[80px]">
          {/* Botón Editar (Naranja/Amber) */}
          <button 
            onClick={() => onOpenEdit(post)} 
            className="p-2 text-amber-600 hover:bg-amber-50 rounded-xl transition-all active:scale-90"
            title="Editar información"
          >
            <Edit size={18} />
          </button>

          {/* Botón Ver (Azul/Indigo) */}
          <button 
            onClick={() => onOpenDetalle(post)} 
            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all active:scale-90"
            title="Ver ficha"
          >
            <Eye size={20} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ReclutamientoRow;