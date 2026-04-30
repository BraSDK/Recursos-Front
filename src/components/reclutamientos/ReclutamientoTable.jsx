import ReclutamientoRow from './ReclutamientoRow';
import { configuracionAreas } from '../../constants/reclutamiento';

const ReclutamientoTable = ({ postulantes, selectedIds, onToggleSelect, onAsistencia, onOpenDetalle, onOpenEdit, loading }) => {

  const area = postulantes.length > 0 ? postulantes[0].area_general : 'ventas';
  const config = configuracionAreas[area] || configuracionAreas['ventas'];
  const diasArray = Array.from({ length: config.dias_capacitacion }, (_, i) => i + 1);

  if (loading) return <div className="text-center py-10 text-gray-500 font-medium italic">Cargando postulantes...</div>;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {/* Checkbox Maestro */}
              <th className="px-4 py-4 text-center">
                <input 
                  type="checkbox"
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                  checked={postulantes.length > 0 && selectedIds.length === postulantes.length}
                  onChange={(e) => {
                    const allIds = postulantes.map(p => p.id);
                    onToggleSelect(e.target.checked ? allIds : []);
                  }}
                />
              </th>
              <th className="px-4 py-4 text-center text-[10px] font-bold text-gray-500 uppercase">N°</th>
              <th className="px-4 py-4 text-left text-xs font-bold text-gray-500 uppercase">Registro</th>
              <th className="px-4 py-4 text-left text-xs font-bold text-gray-500 uppercase">Cierre</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Postulante</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Estado</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">DNI</th>
              <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase">Turno</th>
              {diasArray.map(d => (
                <th key={d} className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase">Día {d}</th>
              ))}
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {postulantes.length > 0 ? (
              postulantes.map((post, index) => (
                <ReclutamientoRow 
                  key={post.id} 
                  post={post} 
                  index={index} 
                  onAsistencia={onAsistencia} 
                  onOpenDetalle={onOpenDetalle} 
                  diasCapacitacion={config.dias_capacitacion}
                  isSelected={selectedIds.includes(post.id)}
                  onToggleSelect={onToggleSelect}
                  onOpenEdit={onOpenEdit}
                />
              ))
            ) : (
              <tr>
                <td colSpan="10" className="px-6 py-12 text-center text-gray-500 italic">No hay postulantes registrados.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReclutamientoTable;