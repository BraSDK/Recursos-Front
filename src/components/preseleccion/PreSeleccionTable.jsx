import { Edit, Trash2, UserCheck, ShieldAlert, Clock, CheckCircle2 } from 'lucide-react';

const PreSeleccionTable = ({ invitaciones, onEdit, onDelete }) => {
  return (
    <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Candidato</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">DNI</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Puesto Destino</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Área Formulario</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Estado</th>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {invitaciones.map((inv) => (
              <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="text-sm font-bold text-gray-900">{inv.nombre_completo}</div>
                  <div className="text-[10px] text-gray-400">Registrado: {new Date(inv.created_at).toLocaleDateString()}</div>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-600">{inv.dni}</td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 font-medium">{inv.puesto?.nombre_puesto}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-tighter ${
                    inv.puesto?.departamento?.area_general === 'ventas' ? 'bg-blue-50 text-blue-600' :
                    inv.puesto?.departamento?.area_general === 'operaciones' ? 'bg-purple-50 text-purple-600' :
                    'bg-orange-50 text-orange-600'
                  }`}>
                    {inv.puesto?.departamento?.area_general}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5">
                    {inv.estado === 'pendiente' ? (
                      <span className="flex items-center gap-1 text-amber-600 text-xs font-bold">
                        <Clock size={14} /> Pendiente
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-green-600 text-xs font-bold">
                        <CheckCircle2 size={14} /> Completado
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => onEdit(inv)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => onDelete(inv.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PreSeleccionTable;