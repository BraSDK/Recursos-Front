import { Edit, UserMinus, Mail, User, ShieldAlert } from 'lucide-react';

const EmpleadoTable = ({ empleados, onEdit, onDelete }) => {
  return (
    <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
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
              <tr key={emp.id} className={`hover:bg-gray-50 transition-colors ${emp.estado === 'inactivo' ? 'opacity-60' : ''}`}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold ${
                      emp.estado === 'activo' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
                    }`}>
                      <User size={20} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-900">{emp.nombres} {emp.apellidos}</div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <Mail size={12} /> {emp.user?.email || 'Sin correo'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 font-medium">{emp.dni}</td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 font-medium">{emp.puesto?.nombre_puesto}</div>
                  <div className="text-[11px] text-gray-400 uppercase font-bold">{emp.puesto?.departamento?.nombre}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                    emp.estado === 'activo' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {emp.estado}
                  </span>
                </td>
                {/* Acciones */}
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-1">
                    <button 
                      onClick={() => onEdit(emp)} 
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                      title="Editar ficha"
                    >
                      <Edit size={18} />
                    </button>
                    
                    {/* LÓGICA SOLICITADA: Solo habilitado si ya está INACTIVO */}
                    {emp.estado === 'inactivo' ? (
                      <button 
                        onClick={() => onDelete(emp.id, `${emp.nombres} ${emp.apellidos}`)} 
                        className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        title="Registrar historial de cese"
                      >
                        <UserMinus size={18} />
                      </button>
                    ) : (
                      <div 
                        className="p-2 text-gray-200 cursor-help" 
                        title="Para dar de baja, primero cambie el estado a Inactivo en la edición"
                      >
                        <ShieldAlert size={18} />
                      </div>
                    )}
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

export default EmpleadoTable;