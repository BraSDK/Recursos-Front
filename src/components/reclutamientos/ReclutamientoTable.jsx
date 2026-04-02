import ReclutamientoRow from './ReclutamientoRow';

const ReclutamientoTable = ({ postulantes, onAsistencia, onOpenDetalle, onOpenEdit, loading }) => {
  if (loading) return <div className="text-center py-10 text-gray-500 font-medium italic">Cargando postulantes...</div>;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-4 text-center text-[10px] font-bold text-gray-500 uppercase">N°</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Postulante</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Estado</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">DNI</th>
              <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase">Turno</th>
              {[1, 2, 3, 4].map(d => (
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
                  onOpenEdit={onOpenEdit}
                />
              ))
            ) : (
              <tr>
                <td colSpan="9" className="px-6 py-12 text-center text-gray-500 italic">No hay postulantes registrados.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReclutamientoTable;