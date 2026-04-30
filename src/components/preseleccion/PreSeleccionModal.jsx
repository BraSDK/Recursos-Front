import { useState, useEffect } from "react";
import { X, UserCheck, Fingerprint, Briefcase, FileText } from "lucide-react";

const PreSeleccionModal = ({ show, onClose, onSave, invitacion, puestos }) => {
  const [formData, setFormData] = useState({
    dni: "",
    nombre_completo: "",
    puesto_id: "",
    estado: "pendiente"
  });

  const [isRendered, setIsRendered] = useState(false);

  // EFECTO 1: Sincronización cuando los puestos llegan tarde
  // Este solo actúa si el modal está abierto y tenemos una invitación pero el puesto_id quedó vacío
  useEffect(() => {
    if (show && invitacion && puestos.length > 0 && !formData.puesto_id) {
      setFormData(prev => ({
        ...prev,
        puesto_id: invitacion.puesto_id
      }));
    }
  }, [puestos, invitacion, show]);

  // EFECTO 2: Reset o Carga inicial al abrir/cerrar
  useEffect(() => {
    if (show) {
      setIsRendered(true);
      if (invitacion) {
        setFormData({
          dni: invitacion.dni || "",
          nombre_completo: invitacion.nombre_completo || "",
          // Si puestos aún no carga, guardamos el ID de todas formas para que el select 
          // lo reconozca apenas el map se renderice
          puesto_id: invitacion.puesto_id || "", 
          estado: invitacion.estado || "pendiente"
        });
      } else {
        setFormData({ dni: "", nombre_completo: "", puesto_id: "", estado: "pendiente" });
      }
    } else {
      const timer = setTimeout(() => setIsRendered(false), 200);
      return () => clearTimeout(timer);
    }
  }, [show, invitacion]); // Quitamos dependencias innecesarias para evitar bucles

  if (!isRendered && !show) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${show ? "opacity-100" : "opacity-0"}`}>
      <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className={`bg-white w-full max-w-lg rounded-2xl shadow-2xl z-10 transition-all duration-300 transform ${show ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}>
        <div className="relative p-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
              <UserCheck size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{invitacion ? "Editar Invitación" : "Nueva Pre-Selección"}</h3>
              <p className="text-sm text-gray-500">Autoriza el acceso al formulario por DNI.</p>
            </div>
          </div>
          <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-md">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="p-6 space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Número de DNI</label>
            <div className="relative">
              <Fingerprint className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input 
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="Ingrese 8 dígitos"
                maxLength={8}
                value={formData.dni}
                onChange={(e) => setFormData({...formData, dni: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Nombre Completo</label>
            <input 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
              placeholder="Ej: Juan Perez Sosa"
              value={formData.nombre_completo}
              onChange={(e) => setFormData({...formData, nombre_completo: e.target.value})}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Puesto a Postular</label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <select 
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg outline-none bg-white appearance-none focus:ring-2 focus:ring-blue-500/20"
                value={formData.puesto_id}
                onChange={(e) => setFormData({...formData, puesto_id: e.target.value})}
                required
              >
                <option value="">Selecciona puesto</option>
                {/* Validamos que puestos sea un array y tenga contenido */}
                {Array.isArray(puestos) && puestos.length > 0 ? (
                  puestos.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre_puesto} - {p.departamento?.nombre || 'Sin Departamento'}
                    </option>
                  ))
                ) : (
                  <option disabled>Cargando puestos...</option>
                )}
              </select>
            </div>
          </div>

          {invitacion && (
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Estado</label>
              <div className="relative">
                <FileText className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <select 
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg outline-none bg-white appearance-none focus:ring-2 focus:ring-blue-500/20"
                  value={formData.estado}
                  onChange={(e) => setFormData({...formData, estado: e.target.value})}
                  required
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="completado">Completado</option>
                  <option value="expirado">Expirado</option>
                </select>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all">
              Cancelar
            </button>
            <button type="submit" className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-sm shadow-blue-200">
              {invitacion ? "Guardar cambios" : "Crear invitación"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PreSeleccionModal;