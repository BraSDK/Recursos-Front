import { Briefcase, Plus, Trash2, Calendar } from 'lucide-react';

const Paso4Experiencia = ({ data, setData, onNext, onBack }) => {
  
  const agregarExperiencia = () => {
    // Aseguramos que trabajamos con un array
    const experienciasActuales = data.experiencia_laboral || [];
    if (experienciasActuales.length < 3) {
      const nuevaExp = { entidad: '', cargo: '', motivo_cese: '', inicio: '', fin: '' };
      setData({ ...data, experiencia_laboral: [...experienciasActuales, nuevaExp] });
    }
  };
  
  const actualizarExperiencia = (index, campo, valor) => {
    const nuevasExp = [...data.experiencia_laboral];
    nuevasExp[index][campo] = valor;
    setData({ ...data, experiencia_laboral: nuevasExp });
  };

  const eliminarExperiencia = (index) => {
    const nuevasExp = data.experiencia_laboral.filter((_, i) => i !== index);
    setData({ ...data, experiencia_laboral: nuevasExp });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-900">Experiencia Laboral</h3>
        <p className="text-sm text-gray-500">Menciona tus últimos 3 empleos.</p>
      </div>

      <div className="space-y-4">
        {(data.experiencia_laboral || []).map((exp, index) => (
          <div key={index} className="p-5 border border-gray-200 rounded-3xl bg-gray-50/50 space-y-3 relative">
            {/* Botón Eliminar */}
            <button 
              onClick={() => eliminarExperiencia(index)}
              className="absolute top-4 right-4 text-red-400 hover:text-red-600 p-1 transition-colors"
            >
              <Trash2 size={18} />
            </button>
            
            <div className="pr-8">
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Empresa / Entidad</label>
              <input 
                placeholder="Nombre de la empresa"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                value={exp.entidad || ''}
                onChange={(e) => actualizarExperiencia(index, 'entidad', e.target.value)}
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Cargo</label>
              <input 
                placeholder="Puesto que ocupabas"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                value={exp.cargo || ''}
                onChange={(e) => actualizarExperiencia(index, 'cargo', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Fecha Inicio</label>
                <input 
                  type="date" 
                  className="w-full px-3 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-white" 
                  value={exp.inicio || ''} 
                  onChange={(e) => actualizarExperiencia(index, 'inicio', e.target.value)} 
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Fecha Fin</label>
                <input 
                  type="date" 
                  className="w-full px-3 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-white" 
                  value={exp.fin || ''} 
                  onChange={(e) => actualizarExperiencia(index, 'fin', e.target.value)} 
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Motivo de Cese</label>
              <input 
                placeholder="¿Por qué dejaste el empleo?"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                value={exp.motivo_cese || ''}
                onChange={(e) => actualizarExperiencia(index, 'motivo_cese', e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>

      {(data.experiencia_laboral || []).length < 3 && (
        <button 
          onClick={agregarExperiencia}
          className="w-full py-4 border-2 border-dashed border-gray-300 rounded-2xl text-gray-500 flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors font-medium"
        >
          <Plus size={20} /> Añadir empleo
        </button>
      )}

      <div className="flex gap-3 pt-4">
        <button 
          onClick={onBack} 
          className="flex-1 py-4 text-gray-500 font-semibold hover:bg-gray-100 rounded-2xl transition-all"
        >
          Atrás
        </button>
        <button 
          onClick={onNext} 
          className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-indigo-700 active:scale-95 transition-all"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default Paso4Experiencia;