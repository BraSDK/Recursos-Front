import { CheckCircle2, XCircle, Eye, Edit } from 'lucide-react';
import { obtenerEstadoDia } from '@/utils/reclutamientoUtils';
import { estadoColors, turnoColors } from '@/constants/reclutamiento';

const ReclutamientoRow = ({ post, index, onAsistencia, onOpenDetalle, onOpenEdit, isSelected, onToggleSelect }) => {
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
        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase ${turnoColors[post.horario_interes] || 'bg-gray-50'}`}>
          {post.horario_interes}
        </span>
      </td>

      {/* Días de Asistencia */}
      {[1, 2, 3, 4].map(dia => {
        const estadoReal = obtenerEstadoDia(post, dia);

        // Lógica de bloqueo: Verificamos si el día anterior está 'asistio'
        // Si dia es 1, el anterior se considera 'asistio' por defecto para no bloquearse
        const diaAnteriorEstado = dia > 1 ? obtenerEstadoDia(post, dia - 1) : 'asistio';
        const estaBloqueado = diaAnteriorEstado !== 'asistio';

        return (
          <td key={dia} className="px-6 py-4 text-center">
            <button 
              disabled={estaBloqueado}
              onClick={(e) => onAsistencia(e, post, dia)}
              className={`transition-all transform p-1 rounded-full 
                ${estaBloqueado ? 'opacity-20 cursor-not-allowed' : 'active:scale-90'}
                ${estadoReal === 'asistio' ? 'text-green-500' : 
                  estadoReal === 'falto' ? 'text-red-500' : 
                  'text-gray-200 hover:text-indigo-500 hover:bg-indigo-50'
                }`}
              title={estaBloqueado ? "Debe completar el día anterior" : `Día ${dia}`}
            >
              {estadoReal === 'falto' ? <XCircle size={24} /> : <CheckCircle2 size={24} />}
            </button>
          </td>
        );
      })}

      {/* Acciones */}
      <td className="px-6 py-4 text-right flex justify-end gap-1">
        {/* Botón Editar (Naranja/Amber) */}
        <button 
          onClick={() => onOpenEdit(post)} 
          className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-all active:scale-95"
          title="Editar información"
        >
          <Edit size={18} />
        </button>

        {/* Botón Ver (Azul/Indigo) */}
        <button 
          onClick={() => onOpenDetalle(post)} 
          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all active:scale-95"
          title="Ver ficha"
        >
          <Eye size={20} />
        </button>
      </td>
    </tr>
  );
};

export default ReclutamientoRow;