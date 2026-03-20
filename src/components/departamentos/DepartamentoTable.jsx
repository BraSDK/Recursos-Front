import { Edit, Trash2, Building2, Hash } from 'lucide-react';

const DepartamentoTable = ({ departamentos, onEdit, onDelete }) => {
  return (
    <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Área / Departamento
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Código Interno
            </th>
            <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {departamentos.length > 0 ? (
            departamentos.map((dep) => (
              <tr key={dep.id} className="hover:bg-gray-50 transition-colors group">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-100 transition-colors">
                      <Building2 size={20} />
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {dep.nombre} {/* Importante: usamos 'nombre' de la BD */}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200 uppercase">
                    <Hash size={12} className="mr-1 text-gray-400" />
                    {dep.codigo_dep}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => onEdit(dep)}
                      className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => onDelete(dep.id, dep.nombre)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="px-6 py-12 text-center">
                <div className="flex flex-col items-center">
                  <Building2 size={40} className="text-gray-200 mb-2" />
                  <p className="text-gray-500 font-medium">No hay departamentos</p>
                  <p className="text-sm text-gray-400">Las áreas que crees aparecerán aquí.</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DepartamentoTable;