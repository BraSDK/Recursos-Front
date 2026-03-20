import { useState, useEffect } from "react";
import { X, Briefcase, Building2, DollarSign } from "lucide-react";

const PuestoModal = ({ show, onClose, onSave, puesto, departamentos }) => {
  const [formData, setFormData] = useState({
    nombre_puesto: "",
    departamento_id: "",
    salario_base: ""
  });

  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    if (show) {
      setIsRendered(true);
      if (puesto) {
        setFormData({
          nombre_puesto: puesto.nombre_puesto,
          departamento_id: puesto.departamento_id,
          salario_base: puesto.salario_base
        });
      } else {
        setFormData({ nombre_puesto: "", departamento_id: "", salario_base: "" });
      }
    } else {
      const timer = setTimeout(() => setIsRendered(false), 200);
      return () => clearTimeout(timer);
    }
  }, [puesto, show]);

  if (!isRendered && !show) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${show ? "opacity-100" : "opacity-0"}`}>
      <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className={`bg-white w-full max-w-lg rounded-2xl shadow-2xl z-10 transition-all duration-300 transform ${show ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}>
        <div className="relative p-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
              <Briefcase size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{puesto ? "Editar Puesto" : "Crear nuevo puesto"}</h3>
              <p className="text-sm text-gray-500">Define los cargos de la empresa.</p>
            </div>
          </div>
          <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-md">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="p-6 space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Nombre del Puesto</label>
            <input 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              value={formData.nombre_puesto}
              onChange={(e) => setFormData({...formData, nombre_puesto: e.target.value})}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Departamento</label>
            <div className="relative">
              <Building2 className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <select 
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg outline-none bg-white appearance-none focus:ring-2 focus:ring-blue-500/20"
                value={formData.departamento_id}
                onChange={(e) => setFormData({...formData, departamento_id: e.target.value})}
                required
              >
                <option value="">Selecciona departamento</option>
                {/* Aquí mapearías los departamentos que traigas de la API */}
                {departamentos.map(dep => (
                  <option key={dep.id} value={dep.id}>{dep.nombre}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Salario Base (Opcional)</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input 
                type="number"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20"
                value={formData.salario_base}
                onChange={(e) => setFormData({...formData, salario_base: e.target.value})}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all">
              Cancelar
            </button>
            <button type="submit" className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-sm shadow-blue-200">
              {puesto ? "Guardar cambios" : "Crear puesto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PuestoModal;