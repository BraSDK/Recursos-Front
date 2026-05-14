import { Edit, Trash2, UserCheck, ShieldAlert, Clock, CheckCircle2 } from 'lucide-react';

const PreSeleccionRow = ({ inv, isSelected, onToggleSelect, onEdit, onDelete }) => {
  const area = inv.puesto?.departamento?.area_general;

  // Configuración de colores por área
  const areaStyles = {
    ventas: "bg-blue-50 text-blue-600 border-blue-100",
    operaciones: "bg-emerald-50 text-emerald-600 border-emerald-100",
    administracion: "bg-orange-50 text-orange-600 border-orange-100"
  };

  return (
    <tr className={`transition-colors ${isSelected ? 'bg-red-50/40' : 'hover:bg-gray-50'}`}>
      {/* Checkbox Individual */}
      <td className="px-6 py-4 text-center">
        <input 
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect([inv.id])}
          className="rounded text-red-600 focus:ring-red-500 cursor-pointer w-4 h-4"
        />
      </td>

      {/* Candidato */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-black text-xs uppercase shadow-sm">
            {inv.nombre_completo.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-gray-900 leading-none mb-1">
              {inv.nombre_completo}
            </span>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
              Registrado: {new Date(inv.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      </td>

      {/* DNI */}
      <td className="px-6 py-4">
        <span className="text-sm font-mono font-bold text-gray-600 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
          {inv.dni}
        </span>
      </td>

      {/* Puesto Destino */}
      <td className="px-6 py-4">
        <div className="text-sm text-gray-900 font-bold">
          {inv.puesto?.nombre_puesto || 'S.I'}
        </div>
      </td>

      {/* Área */}
      <td className="px-6 py-4">
        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${areaStyles[area] || 'bg-gray-50 text-gray-500'}`}>
          {area}
        </span>
      </td>

      {/* Estado */}
      <td className="px-6 py-4">
        {inv.estado === 'pendiente' ? (
          <span className="flex items-center gap-1.5 text-amber-600 text-[10px] font-black uppercase tracking-wider">
            <Clock size={14} strokeWidth={3} /> Pendiente
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-green-600 text-[10px] font-black uppercase tracking-wider">
            <CheckCircle2 size={14} strokeWidth={3} /> Completado
          </span>
        )}
      </td>

      {/* Acciones */}
      <td className="px-6 py-4 text-right">
        <div className="flex justify-end gap-1">
          <button 
            onClick={() => onEdit(inv)} 
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
            title="Editar"
          >
            <Edit size={18} />
          </button>
          <button 
            onClick={() => onDelete(inv.id)} 
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
            title="Eliminar"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default PreSeleccionRow;