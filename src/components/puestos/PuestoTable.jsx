import { Edit, Trash2, Building2, DollarSign, Briefcase } from 'lucide-react';

const PuestoTable = ({ puestos, onEdit, onDelete }) => {
  return (
    <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cargo / Puesto
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Departamento
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Salario Base
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {puestos.length > 0 ? (
              puestos.map((puesto) => (
                <tr key={puesto.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-100 transition-colors">
                        <Briefcase size={20} />
                      </div>
                      <span className="text-sm font-semibold text-gray-900">
                        {puesto.nombre_puesto}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-600">
                      <Building2 size={14} className="mr-1.5 text-gray-400" />
                      {puesto.departamento?.nombre || 'Sin asignar'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm font-medium text-gray-900">
                      <DollarSign size={14} className="text-green-500 mr-0.5" />
                      {puesto.salario_base 
                        ? Number(puesto.salario_base).toLocaleString('es-PE', { minimumFractionDigits: 2 }) 
                        : '0.00'
                      }
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => onEdit(puesto)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="Editar puesto"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => onDelete(puesto.id, puesto.nombre_puesto)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Eliminar puesto"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center">
                    <Briefcase size={40} className="text-gray-200 mb-2" />
                    <p className="text-gray-500 font-medium">No hay puestos registrados</p>
                    <p className="text-sm text-gray-400">Comienza agregando un nuevo cargo al sistema.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PuestoTable;