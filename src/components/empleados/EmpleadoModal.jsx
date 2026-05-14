import { useState, useEffect } from "react";
import { X, UserPlus, Mail, Fingerprint, Calendar, Briefcase, Activity, FileText } from "lucide-react";

const EmpleadoModal = ({ show, onClose, onSave, empleado, puestos, postulantePreload }) => {
  const [formData, setFormData] = useState({
    nombres: "", apellidos: "", dni: "", email: "", 
    puesto_id: "", fecha_ingreso: "", estado: "activo", 
    postulante_id: null,
    // Campos nuevos para vacaciones
    fecha_inicio_vacas: "", fecha_fin_vacas: "", obs_vacas: ""
  });

  const [isRendered, setIsRendered] = useState(false);

  const puestosFiltrados = (() => {
    if (!Array.isArray(puestos)) return [];

    // CASO 1: Si estamos EDITANDO o es un REGISTRO MANUAL desde cero
    if (empleado || (!postulantePreload && !empleado)) {
      return puestos;
    }

    // CASO 2: Si viene de la CAMPANITA (postulantePreload)
    if (postulantePreload) {
      return puestos.filter(p => p.id === postulantePreload.puesto_id);
    }

    return puestos;
  })();

  useEffect(() => {
    if (show) {
      setIsRendered(true);
      const defaultData = {
        nombres: "", apellidos: "", dni: "", email: "", 
        puesto_id: "", fecha_ingreso: new Date().toISOString().split('T')[0],
        estado: "activo", postulante_id: null,
        fecha_inicio_vacas: "", fecha_fin_vacas: "", obs_vacas: ""
      };

      if (postulantePreload) {
        setFormData({
          ...defaultData,
          nombres: postulantePreload.nombres || "",
          apellidos: postulantePreload.apellidos || "",
          dni: postulantePreload.dni || "",
          puesto_id: postulantePreload.puesto_id || "",
          postulante_id: postulantePreload.postulante_id
        });
      } else if (empleado) {
        // Buscamos si tiene registros de vacaciones
        const listaVacas = empleado.vacaciones || [];
        const ultimaVaca = listaVacas.length > 0 ? listaVacas[listaVacas.length - 1] : null;

        setFormData({ 
          ...defaultData,
          ...empleado, 
          email: empleado.user?.email || "",
          fecha_inicio_vacas: ultimaVaca?.fecha_inicio ? ultimaVaca.fecha_inicio.substring(0, 10) : "",
          fecha_fin_vacas: ultimaVaca?.fecha_fin ? ultimaVaca.fecha_fin.substring(0, 10) : "",
          obs_vacas: ultimaVaca?.observaciones || "",
          postulante_id: null
          // Si ya está de vacaciones, podrías cargar la última si fuera necesario, 
          // pero usualmente aquí se registran las NUEVAS.
        });
      } else {
        setFormData(defaultData);
      }
    } else {
      const timer = setTimeout(() => setIsRendered(false), 200);
      return () => clearTimeout(timer);
    }
  }, [empleado, show, postulantePreload]);

  if (!isRendered && !show) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${show ? "opacity-100" : "opacity-0"}`}>
      <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />

      {/* Aumentamos el ancho a max-w-2xl para el diseño horizontal */}
      <div className={`bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden z-10 transition-all duration-300 transform ${show ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}>
        
        <div className="relative p-6 border-b border-gray-100 bg-gray-50/30">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-200">
              <UserPlus size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{empleado ? "Editar Perfil de Empleado" : "Registrar Nuevo Empleado"}</h3>
              <p className="text-sm text-gray-500">Gestión de datos de planilla y cuenta de acceso.</p>
            </div>
          </div>
          <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-all">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="p-8">
          <div className="grid grid-cols-2 gap-x-8 gap-y-6">
            
            {/* COLUMNA IZQUIERDA: Identidad */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest border-b border-blue-100 pb-2">Información Personal</h4>
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">Nombres</label>
                <input 
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm"
                  value={formData.nombres}
                  onChange={(e) => setFormData({...formData, nombres: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">Apellidos</label>
                <input 
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm"
                  value={formData.apellidos}
                  onChange={(e) => setFormData({...formData, apellidos: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">DNI</label>
                <div className="relative">
                  <Fingerprint className="absolute left-3 top-2.5 text-gray-400" size={16} />
                  <input 
                    className="w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                    value={formData.dni}
                    onChange={(e) => setFormData({...formData, dni: e.target.value})}
                    required
                  />
                </div>
              </div>
            </div>

            {/* COLUMNA DERECHA: Laboral */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest border-b border-blue-100 pb-2">Datos de Empresa</h4>
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">Correo Institucional</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 text-gray-400" size={16} />
                  <input 
                    type="email"
                    className="w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">Cargo / Puesto</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-2.5 text-gray-400" size={16} />
                  <select 
                    className={`w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm appearance-none ${
                      postulantePreload ? "bg-blue-50 border-blue-200 text-blue-700 cursor-not-allowed" : ""
                    }`}
                    value={formData.puesto_id}
                    onChange={(e) => setFormData({...formData, puesto_id: e.target.value})}
                    required
                    // Bloqueamos el cambio si viene de reclutamiento para mantener la integridad del proceso
                    disabled={!!postulantePreload} 
                  >
                    <option value="">Seleccionar puesto...</option>
                    {Array.isArray(puestosFiltrados) && puestosFiltrados.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.nombre_puesto}
                      </option>
                    ))}
                  </select>
                  {/* Pequeña nota informativa solo si viene de reclutamiento */}
                  {postulantePreload && (
                    <p className="text-[9px] text-blue-500 font-bold mt-1 px-1 uppercase">
                      Puesto vinculado al proceso de selección
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700">Fecha Ingreso</label>
                  <input 
                    type="date"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                    value={formData.fecha_ingreso}
                    onChange={(e) => setFormData({...formData, fecha_ingreso: e.target.value})}
                  />
                </div>
                {empleado && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">Estado</label>
                    <select 
                      className={`w-full px-3 py-2 border rounded-lg text-xs font-black uppercase ${
                        formData.estado === 'activo' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-orange-50 border-orange-200 text-orange-700'
                      }`}
                      value={formData.estado}
                      onChange={(e) => setFormData({...formData, estado: e.target.value})}
                    >
                      <option value="activo">Activo</option>
                      <option value="vacaciones">Vacaciones</option>
                      <option value="inactivo">Inactivo</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SECCIÓN DINÁMICA: Vacaciones (Aparece a todo lo ancho si el estado es vacaciones) */}
          {formData.estado === 'vacaciones' && (
            <div className="mt-8 pt-6 border-t border-orange-100 bg-orange-50/30 rounded-2xl p-6 animate-in slide-in-from-top-2 duration-300">
              <div className="flex items-center gap-2 mb-4 text-orange-700">
                <Activity size={18} />
                <h4 className="text-sm font-bold uppercase tracking-wider">Registro de Periodo Vacacional</h4>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600">Fecha Inicio</label>
                  <input 
                    type="date"
                    className="w-full px-3 py-2 border border-orange-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500/20"
                    value={formData.fecha_inicio_vacas}
                    onChange={(e) => setFormData({...formData, fecha_inicio_vacas: e.target.value})}
                    required={formData.estado === 'vacaciones'}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600">Fecha Fin</label>
                  <input 
                    type="date"
                    className="w-full px-3 py-2 border border-orange-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500/20"
                    value={formData.fecha_fin_vacas}
                    onChange={(e) => setFormData({...formData, fecha_fin_vacas: e.target.value})}
                    required={formData.estado === 'vacaciones'}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-600">Observaciones</label>
                  <input 
                    className="w-full px-3 py-2 border border-orange-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500/20"
                    placeholder="Ej: Vacaciones 2026"
                    value={formData.obs_vacas}
                    onChange={(e) => setFormData({...formData, obs_vacas: e.target.value})}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-4 pt-8 mt-4 border-t border-gray-100">
            <button type="button" onClick={onClose} className="flex-1 py-3 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-all">
              Descartar
            </button>
            <button type="submit" className="flex-[2] py-3 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2">
              <FileText size={18} /> {empleado ? "Actualizar Información" : "Confirmar Alta de Empleado"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmpleadoModal;