import { useState, useEffect } from "react";
import { X, Building2, Hash, PlusCircle } from "lucide-react";

const DepartamentoModal = ({ show, onClose, onSave, departamento }) => {
  const [formData, setFormData] = useState({
    nombre_departamento: "", // Nombre que espera el controlador
    codigo_dep: ""
  });

  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    if (show) {
      setIsRendered(true);
      if (departamento) {
        setFormData({
          nombre_departamento: departamento.nombre, // Mapeamos de 'nombre' a 'nombre_departamento'
          codigo_dep: departamento.codigo_dep
        });
      } else {
        setFormData({ nombre_departamento: "", codigo_dep: "" });
      }
    } else {
      const timer = setTimeout(() => setIsRendered(false), 200);
      return () => clearTimeout(timer);
    }
  }, [departamento, show]);

  if (!isRendered && !show) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${show ? "opacity-100" : "opacity-0"}`}>
      <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className={`bg-white w-full max-w-lg rounded-2xl shadow-2xl z-10 transition-all duration-300 transform ${show ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}>
        <div className="relative p-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
              <Building2 size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {departamento ? "Editar Departamento" : "Nuevo Departamento"}
              </h3>
              <p className="text-sm text-gray-500">Organiza las áreas de tu empresa.</p>
            </div>
          </div>
          <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-md">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="p-6 space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Nombre del Área</label>
            <div className="relative">
              <Building2 className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input 
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all shadow-sm"
                placeholder="Ej. Recursos Humanos"
                value={formData.nombre_departamento}
                onChange={(e) => setFormData({...formData, nombre_departamento: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Código de Departamento</label>
            <div className="relative">
              <Hash className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input 
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all shadow-sm"
                placeholder="Ej. RRHH"
                value={formData.codigo_dep}
                onChange={(e) => setFormData({...formData, codigo_dep: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all">
              Cancelar
            </button>
            <button type="submit" className="flex-1 px-4 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-200">
              {departamento ? "Guardar cambios" : "Crear área"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DepartamentoModal;