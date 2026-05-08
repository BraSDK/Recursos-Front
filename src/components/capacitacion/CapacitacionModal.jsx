import React, { useEffect, useState } from 'react';
import { X, Save, Trash2 } from 'lucide-react';

const CapacitacionModal = ({ show, onClose, onSave, onDelete, initialData }) => {
  const [formData, setFormData] = useState({
    nombre_grupo: '',
    area_general: 'ventas',
    fecha_capacitacion: '',
    hora_capacitacion: '',
    estado: 'abierto'
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        nombre_grupo: '',
        area_general: 'ventas',
        fecha_capacitacion: '',
        hora_capacitacion: '',
        estado: 'abierto'
      });
    }
  }, [initialData, show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
          <h3 className="text-lg font-bold text-gray-900">
            {initialData?.id ? 'Editar Capacitación' : 'Nueva Capacitación'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
        </div>

        <form className="p-6 space-y-4" onSubmit={(e) => { e.preventDefault(); onSave(formData); }}>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nombre del Grupo</label>
            <input 
              required
              className="w-full border rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20"
              value={formData.nombre_grupo}
              onChange={(e) => setFormData({...formData, nombre_grupo: e.target.value})}
              placeholder="Ej: Inducción Ventas Mayo"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Área</label>
              <select 
                className="w-full border rounded-xl p-2.5 outline-none"
                value={formData.area_general}
                onChange={(e) => setFormData({...formData, area_general: e.target.value})}
              >
                <option value="ventas">Ventas</option>
                <option value="operaciones">Operaciones</option>
                <option value="administracion">Administración</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Estado</label>
              <select 
                className="w-full border rounded-xl p-2.5 outline-none"
                value={formData.estado}
                onChange={(e) => setFormData({...formData, estado: e.target.value})}
              >
                <option value="abierto">Abierto</option>
                <option value="en_curso">En Curso</option>
                <option value="finalizado">Finalizado</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Fecha</label>
              <input 
                type="date"
                required
                className="w-full border rounded-xl p-2.5 outline-none"
                value={formData.fecha_capacitacion}
                onChange={(e) => setFormData({...formData, fecha_capacitacion: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Hora</label>
              <input 
                type="time"
                required
                className="w-full border rounded-xl p-2.5 outline-none"
                value={formData.hora_capacitacion}
                onChange={(e) => setFormData({...formData, hora_capacitacion: e.target.value})}
              />
            </div>
          </div>

          <div className="pt-4 flex gap-2">
            {initialData?.id && (
              <button 
                type="button"
                onClick={() => onDelete(initialData.id)}
                className="flex-1 bg-red-50 text-red-600 font-bold py-3 rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 size={18}/> Eliminar
              </button>
            )}
            <button 
              type="submit"
              className="flex-[2] bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-100"
            >
              <Save size={18}/> {initialData?.id ? 'Guardar Cambios' : 'Crear Grupo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CapacitacionModal;