import { useState, useEffect } from "react";
import { X, UserPlus, Mail, Fingerprint, Calendar, Briefcase } from "lucide-react";

const EmpleadoModal = ({ show, onClose, onSave, empleado, puestos }) => {
  const [formData, setFormData] = useState({
    nombres: "", apellidos: "", dni: "", email: "", puesto_id: "", fecha_ingreso: ""
  });

  // Estado para controlar la renderización de la animación
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    if (show) {
      setIsRendered(true);
      if (empleado) {
        setFormData({ ...empleado, email: empleado.user?.email || "" });
      } else {
        setFormData({ 
          nombres: "", apellidos: "", dni: "", email: "", 
          puesto_id: "", fecha_ingreso: new Date().toISOString().split('T')[0] 
        });
      }
    } else {
      // Pequeño delay para permitir que la animación de salida (si la hubiera) termine
      const timer = setTimeout(() => setIsRendered(false), 200);
      return () => clearTimeout(timer);
    }
  }, [empleado, show]);

  if (!isRendered && !show) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
        show ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Backdrop (Fondo oscuro) con blur */}
      <div 
        className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" 
        onClick={onClose}
      />

      {/* Contenedor del Modal con Animación Shadcn Style */}
      <div 
        className={`bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden z-10 
          transition-all duration-300 transform
          ${show ? "scale-100 opacity-100" : "scale-95 opacity-0"}
        `}
      >
        
        {/* Header al estilo Untitled UI */}
        <div className="relative p-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
              <UserPlus size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {empleado ? "Editar Empleado" : "Registrar nuevo empleado"}
              </h3>
              <p className="text-sm text-gray-500">Completa la información del perfil.</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-md"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cuerpo del Formulario */}
        <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Nombres</label>
              <input 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
                value={formData.nombres}
                onChange={(e) => setFormData({...formData, nombres: e.target.value})}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Apellidos</label>
              <input 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
                value={formData.apellidos}
                onChange={(e) => setFormData({...formData, apellidos: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Correo institucional</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input 
                type="email"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
                placeholder="ejemplo@empresa.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">DNI</label>
              <div className="relative">
                <Fingerprint className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input 
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
                  value={formData.dni}
                  onChange={(e) => setFormData({...formData, dni: e.target.value})}
                  required
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Fecha Ingreso</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input 
                  type="date"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
                  value={formData.fecha_ingreso}
                  onChange={(e) => setFormData({...formData, fecha_ingreso: e.target.value})}
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Cargo / Puesto</label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <select 
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none appearance-none bg-white transition-all shadow-sm"
                value={formData.puesto_id}
                onChange={(e) => setFormData({...formData, puesto_id: e.target.value})}
                required
              >
                <option value="">Selecciona un puesto</option>
                {puestos.map(p => (
                  <option key={p.id} value={p.id}>{p.nombre_puesto}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 pt-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all shadow-sm"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-sm shadow-blue-200"
            >
              {empleado ? "Guardar cambios" : "Crear empleado"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmpleadoModal;