import { Edit, Trash2, Mail, User } from 'lucide-react';

const EmpleadoTable = ({ empleados, onEdit, onDelete }) => {
  return (
    <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Empleado</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">DNI</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Cargo</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
            <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {empleados.map((emp) => (
            <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <User size={20} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{emp.nombres} {emp.apellidos}</div>
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                       <Mail size={12} /> {emp.user?.email}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600 font-medium">{emp.dni}</td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">{emp.puesto?.nombre_puesto}</div>
                <div className="text-xs text-gray-500">{emp.puesto?.departamento?.nombre}</div>
              </td>
              <td className="px-6 py-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  emp.estado === 'activo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {emp.estado}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2">
                  <button onClick={() => onEdit(emp)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => onDelete(emp.id, emp.nombres)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmpleadoTable;