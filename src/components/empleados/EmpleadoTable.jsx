import { Edit, Trash2 } from 'lucide-react';

const EmpleadoTable = ({ empleados, onEdit, onDelete }) => {
  return (
    <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-100">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Empleado</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">DNI</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Puesto / Departamento</th>
            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {empleados.length > 0 ? (
            empleados.map(emp => (
              <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {emp.nombres} {emp.apellidos}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {emp.dni}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{emp.puesto?.nombre_puesto || 'Sin puesto'}</div>
                  <div className="text-xs text-gray-400">{emp.puesto?.departamento?.nombre || 'General'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-3">
                    <button 
                      onClick={() => onEdit(emp)} 
                      className="text-indigo-600 hover:text-indigo-900 flex items-center"
                    >
                      <Edit className="w-4 h-4 mr-1" /> Editar
                    </button>
                    <button 
                      onClick={() => onDelete(emp.id, `${emp.nombres}`)} 
                      className="text-red-600 hover:text-red-900 flex items-center"
                    >
                      <Trash2 className="w-4 h-4 mr-1" /> Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="px-6 py-10 text-center text-gray-500">
                No se encontraron empleados.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EmpleadoTable;