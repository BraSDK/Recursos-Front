import { GraduationCap, Plus, Trash2 } from 'lucide-react';

const Paso3Academico = ({ data, setData, onNext, onBack }) => {
  
  const agregarEstudio = () => {
    const nuevo = { nivel: '', institucion: '', especialidad: '', estado: '', ciclo: '' };
    // Inicializamos con un array si por alguna razón data.formacion_academica es nulo
    const estudiosActuales = data.formacion_academica || [];
    setData({ ...data, formacion_academica: [...estudiosActuales, nuevo] });
  };

  const actualizarEstudio = (index, campo, valor) => {
    const nuevos = [...data.formacion_academica];
    nuevos[index][campo] = valor;

    // Limpieza: Si el estado cambia a "Completo", reseteamos el ciclo
    if (campo === 'estado' && valor === 'Completo') {
      nuevos[index]['ciclo'] = '';
    }

    setData({ ...data, formacion_academica: nuevos });
  };

  const eliminarEstudio = (index) => {
    const nuevos = data.formacion_academica.filter((_, i) => i !== index);
    setData({ ...data, formacion_academica: nuevos });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-900">Estudios</h3>
        <p className="text-sm text-gray-500">Registra tu formación académica (puedes añadir varios).</p>
      </div>

      <div className="space-y-4">
        {(data.formacion_academica || []).map((est, index) => (
          <div key={index} className="p-5 border border-indigo-100 rounded-3xl bg-indigo-50/30 space-y-3 relative">
            {/* Botón Eliminar */}
            <button 
              onClick={() => eliminarEstudio(index)}
              className="absolute top-4 right-4 text-red-400 hover:text-red-600 p-1 transition-colors"
              title="Eliminar estudio"
            >
              <Trash2 size={18} />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-8">
              <div>
                <label className="text-[10px] font-bold text-indigo-400 uppercase ml-1">Nivel</label>
                <select 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-indigo-500"
                  value={est.nivel || ''}
                  onChange={(e) => actualizarEstudio(index, 'nivel', e.target.value)}
                >
                  <option value="">Selecciona nivel</option>
                  <option value="Secundaria">Secundaria</option>
                  <option value="Tecnico">Técnico</option>
                  <option value="Universitario">Universitario</option>
                  <option value="Postgrado">Postgrado / Otros</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-indigo-400 uppercase ml-1">Estado</label>
                <select 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-indigo-500"
                  value={est.estado || ''}
                  onChange={(e) => actualizarEstudio(index, 'estado', e.target.value)}
                >
                  <option value="">Seleccionar Estado</option>
                  <option value="Completo">Completo</option>
                  <option value="Incompleto">Incompleto</option>
                  <option value="Cursando">Cursando</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-indigo-400 uppercase ml-1">Institución</label>
              <input 
                placeholder="Ej. SENATI, UNMSM..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500"
                value={est.institucion || ''}
                onChange={(e) => actualizarEstudio(index, 'institucion', e.target.value)}
              />
            </div>

            <div className={`grid gap-3 transition-all duration-300 ${ (est.estado === 'Incompleto' || est.estado === 'Cursando') ? 'grid-cols-2' : 'grid-cols-1' }`}>
              <div>
                <label className="text-[10px] font-bold text-indigo-400 uppercase ml-1">Especialidad</label>
                <input 
                  placeholder="Carrera / Curso"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500"
                  value={est.especialidad || ''}
                  onChange={(e) => actualizarEstudio(index, 'especialidad', e.target.value)}
                />
              </div>

              {/* CAMPO DINÁMICO: Solo aparece si es Incompleto o Cursando */}
              {(est.estado === 'Incompleto' || est.estado === 'Cursando') && (
                <div className="animate-in slide-in-from-left-2 duration-300">
                  <label className="text-[10px] font-bold text-orange-500 uppercase ml-1">Ciclo Actual</label>
                  <select 
                    className="w-full px-4 py-3 rounded-xl border border-orange-200 bg-white outline-none focus:ring-2 focus:ring-orange-500"
                    value={est.ciclo || ''}
                    onChange={(e) => actualizarEstudio(index, 'ciclo', e.target.value)}
                  >
                    <option value="">¿Qué ciclo?</option>
                    {[...Array(12)].map((_, i) => (
                      <option key={i+1} value={i+1}>{i+1} Ciclo</option>
                    ))}
                    <option value="Egreso">Egresado (Sin título)</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <button 
        onClick={agregarEstudio}
        className="w-full py-4 border-2 border-dashed border-indigo-200 rounded-2xl text-indigo-600 flex items-center justify-center gap-2 hover:bg-indigo-50 transition-colors font-medium"
      >
        <Plus size={20} /> Añadir otro estudio
      </button>

      <div className="flex gap-3 pt-4">
        <button onClick={onBack} className="flex-1 py-4 text-gray-500 font-semibold hover:bg-gray-100 rounded-2xl transition-all">
          Atrás
        </button>
        <button onClick={onNext} className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-indigo-700 active:scale-95 transition-all">
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default Paso3Academico;