import PreSeleccionRow from './PreSeleccionRow';

const PreSeleccionTable = ({ invitaciones, selectedIds, onToggleSelect, onEdit, onDelete }) => {
  return (
    <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {/* Checkbox Maestro */}
              <th className="px-4 py-4 text-center">
                <input 
                  type="checkbox"
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                  checked={invitaciones.length > 0 && selectedIds.length === invitaciones.length}
                  onChange={(e) => {
                    const allIds = invitaciones.map(p => p.id);
                    onToggleSelect(e.target.checked ? allIds : []);
                  }}
                />
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Candidato</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">DNI</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Puesto Destino</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Área Formulario</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Estado</th>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {invitaciones.length > 0 ? (
              invitaciones.map((inv) => (
                <PreSeleccionRow 
                  key={inv.id} 
                  inv={inv} 
                  isSelected={selectedIds.includes(inv.id)}
                  onToggleSelect={onToggleSelect} 
                  onEdit={onEdit} 
                  onDelete={onDelete} 
                />
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center text-gray-400 italic text-sm">
                  No se encontraron invitaciones pendientes.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PreSeleccionTable;