import { useState, useEffect } from "react";
import { X, Building2, Hash, Layers, PlusCircle } from "lucide-react";

const DepartamentoModal = ({ show, onClose, onSave, departamento }) => {
  const [formData, setFormData] = useState({
    nombre_departamento: "", // Nombre que espera el controlador
    codigo_dep: "",
    area_general: "administrativo"
  });

  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    if (show) {
      setIsRendered(true);
      if (departamento) {
        setFormData({
          nombre_departamento: departamento.nombre, // Mapeamos de 'nombre' a 'nombre_departamento'
          codigo_dep: departamento.codigo_dep,
          area_general: departamento.area_general || "administrativo"
        });
      } else {
        setFormData({ nombre_departamento: "", codigo_dep: "", area_general: "administrativo" });
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

          <div className="space-y-3">
            <label className="text-sm font-bold text-gray-700 ml-1 flex items-center gap-2">
              <Layers size={16} className="text-indigo-500" /> 
              Área General (Configura el Formulario Público)
            </label>
            
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'administrativo', label: 'Admin', icon: <Building2 size={16}/>, color: 'orange' },
                { id: 'ventas', label: 'Ventas', icon: <PlusCircle size={16}/>, color: 'blue' },
                { id: 'operaciones', label: 'Operaciones', icon: <Hash size={16}/>, color: 'purple' }
              ].map((opcion) => (
                <button
                  key={opcion.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, area_general: opcion.id })}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-200 group ${
                    formData.area_general === opcion.id
                      ? `border-${opcion.color}-500 bg-${opcion.color}-50 text-${opcion.color}-700 shadow-sm`
                      : "border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200 hover:bg-white"
                  }`}
                >
                  <div className={`mb-1.5 p-2 rounded-lg transition-colors ${
                    formData.area_general === opcion.id 
                      ? `bg-white text-${opcion.color}-600` 
                      : "bg-gray-200/50 text-gray-400 group-hover:bg-gray-200"
                  }`}>
                    {opcion.icon}
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-tight">
                    {opcion.label}
                  </span>
                </button>
              ))}
            </div>
            
            {/* Pequeño texto informativo según la selección */}
            <p className="text-[10px] text-gray-400 italic px-1">
              * Los postulantes de esta área verán el formulario de tipo 
              <span className="font-bold text-indigo-500"> {formData.area_general}</span>.
            </p>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-50">
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