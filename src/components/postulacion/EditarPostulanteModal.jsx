import { useState, useEffect } from "react";
import { X, Save, Lock } from "lucide-react";
import { obtenerEstadoDia } from '@/utils/reclutamientoUtils';

const EditarPostulanteModal = ({ show, onClose, postulante, onUpdate }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (postulante) setFormData({ ...postulante });
  }, [postulante]);

  if (!show || !postulante) return null;

  // Validación: ¿Completó el proceso de 4 días?
  const completoCapacitacion = obtenerEstadoDia(postulante, 4) === 'asistio';

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-900">Editar Información</h3>
          <button type="button" onClick={onClose}><X className="text-gray-400" /></button>
        </div>

        <div className="p-8 overflow-y-auto space-y-6">
          {/* Formulario de datos básicos */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase">Nombres</label>
              <input 
                className="w-full border rounded-xl p-2.5 mt-1" 
                value={formData.nombres || ''} 
                onChange={(e) => setFormData({...formData, nombres: e.target.value})}
              />
            </div>
            {/* ... Otros campos: Apellidos, Celular, etc. ... */}
          </div>

          {/* SECCIÓN DE ESTADO FINAL (CRÍTICA) */}
          <div className={`p-4 rounded-2xl border-2 ${completoCapacitacion ? 'border-green-100 bg-green-50' : 'border-gray-100 bg-gray-50'}`}>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-bold text-gray-700 uppercase flex items-center gap-2">
                Estado del Proceso {!completoCapacitacion && <Lock size={14} className="text-gray-400" />}
              </label>
              {!completoCapacitacion && (
                <span className="text-[10px] bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full font-bold">
                  BLOQUEADO HASTA DÍA 4
                </span>
              )}
            </div>
            
            <select 
              disabled={!completoCapacitacion}
              value={formData.estado_proceso}
              onChange={(e) => setFormData({...formData, estado_proceso: e.target.value})}
              className="w-full border rounded-xl p-3 bg-white font-bold text-gray-700 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="capacitacion">En Capacitación</option>
              <option value="gestion">Apto (Pasar a Gestión)</option>
              <option value="no_apto">No Apto (Descartar)</option>
            </select>
          </div>
        </div>

        <div className="p-6 bg-gray-50 border-t flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-6 py-2 text-gray-500 font-bold">Cancelar</button>
          <button type="submit" className="px-8 py-2 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 flex items-center gap-2">
            <Save size={18} /> Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditarPostulanteModal;