import { useState, useEffect } from "react";
import { X, Save, User, Briefcase, HeartPulse, Camera } from "lucide-react";
import { obtenerEstadoDia } from '@/utils/reclutamientoUtils';
import { estadoColors, turnoColors } from '@/constants/reclutamiento';
import ConfirmActionModal from '../shared/ConfirmPostuModal';

const EditarPostulanteModal = ({ show, onClose, postulante, onUpdate }) => {
  const [formData, setFormData] = useState({});
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null); // Estado para la previsualización local
  const [archivoParaSubir, setArchivoParaSubir] = useState(null); // Archivo en memoria
  const [alerta, setAlerta] = useState({ 
    show: false, 
    title: '', 
    message: '', 
    variant: 'indigo', 
    onConfirm: null 
  });

  useEffect(() => {
    if (postulante) {
      setFormData({ ...postulante, es_reingreso: !!postulante.es_reingreso });
      setPreviewUrl(null); // Resetear al cambiar de postulante
      setArchivoParaSubir(null);
    }
  }, [postulante]);

  if (!show || !postulante) return null;

  const completoCapacitacion = obtenerEstadoDia(postulante, 4) === 'asistio';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 1. Generamos una URL temporal para que el navegador la muestre ya mismo
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);

    // 2. Guardamos el archivo en el estado, pero NO llamamos a ninguna API aún
    setArchivoParaSubir(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const estadoOriginal = postulante.estado_proceso;
    const nuevoEstado = formData.estado_proceso;
    const tieneAsistencias = postulante.procesos_seleccion?.length > 0;

    // CASO 1: Retroceder a Reclutamiento teniendo asistencias
    if (estadoOriginal === 'capacitacion' && nuevoEstado === 'reclutamiento' && tieneAsistencias) {
      setAlerta({
        show: true,
        title: "Confirmar Retroceso",
        message: "Al volver a Reclutamiento, se borrarán todos los días de asistencia registrados. ¿Desea continuar?",
        variant: "amber",
        // CAMBIO AQUÍ: Usar onConfirm en lugar de action
        onConfirm: () => {
          onUpdate(formData, archivoParaSubir);
          setAlerta(prev => ({ ...prev, show: false })); // Cerramos la alerta tras confirmar
        }
      });
      return;
    }

    // CASO 2: Mover a No Apto teniendo asistencias
    if (nuevoEstado === 'no_apto' && tieneAsistencias) {
      setAlerta({
        show: true,
        title: "Descartar Postulante",
        message: "Este postulante tiene días asistidos. Si lo marca como No Apto, el registro de capacitación se mantendrá pero el proceso finalizará. ¿Seguro?",
        variant: "red",
        // CAMBIO AQUÍ: Usar onConfirm en lugar de action
        onConfirm: () => {
          onUpdate(formData, archivoParaSubir);
          setAlerta(prev => ({ ...prev, show: false }));
        }
      });
      return;
    }

    // Si no hay conflictos, guardar directo

    onUpdate(formData, archivoParaSubir);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <form onSubmit={handleSubmit} className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl z-10 overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-50 rounded-2xl text-amber-600 shadow-sm">
              <User size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 leading-none mb-1">Editar Información</h3>
              <p className="text-xs text-gray-500">Actualizando datos de DNI: {postulante.dni}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <X size={24} className="text-gray-400" />
          </button>
        </div>

        {/* Cuerpo con Scroll */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Columna Izquierda: Foto y Control de Estado */}
            <div className="space-y-6">
              <div className="relative group mx-auto w-48 h-48">
              <div className="w-full h-full rounded-3xl bg-gray-50 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden shadow-inner">
                {/* LÓGICA DE PREVISUALIZACIÓN PRIORITARIA */}
                {previewUrl ? (
                  // Si hay algo en previewUrl, es porque el usuario seleccionó un archivo nuevo
                  <img src={previewUrl} className="w-full h-full object-cover" alt="Previsualización nueva" />
                ) : postulante.foto_path ? (
                  // Si no hay preview, pero el postulante ya tiene foto en BD, mostramos esa
                  <img src={`http://sistema-rrhh.test/storage/${postulante.foto_path}`} className="w-full h-full object-cover" alt="Perfil actual" />
                ) : (
                  // Si no hay nada de lo anterior, el icono gris por defecto
                  <div className="text-center text-gray-300 p-4">
                    <User size={48} className="mx-auto mb-2 opacity-20" />
                    <p className="text-[10px] font-bold uppercase">Subir Foto Oficial</p>
                  </div>
                )}
              </div>
                <label className="absolute bottom-2 right-2 p-3 bg-indigo-600 text-white rounded-2xl cursor-pointer shadow-lg hover:bg-indigo-700 transition-all active:scale-90">
                  <Camera size={20} />
                  {/* Input oculto: al cambiar solo actualiza el estado local, NO sube a la API todavía */}
                  <input 
                    type="file" 
                    className="hidden" 
                    onChange={handleFotoChange} 
                    accept="image/*"
                    disabled={uploading} 
                  />
                </label>
              </div>

              <div className="bg-gray-50 p-5 rounded-3xl space-y-4 border border-gray-100">
                <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Estado del Proceso</label>
                    <select 
                        name="estado_proceso"
                        value={formData.estado_proceso}
                        onChange={handleChange}
                        className="w-full border rounded-xl p-2.5 text-sm font-bold bg-white"
                    >
                        <option value="reclutamiento">Reclutamiento</option>
                        <option value="capacitacion">Capacitación</option>
                        <option value="no_apto">No Apto (Descartar)</option>
                        <option value="gestion" disabled={!completoCapacitacion}>
                            {completoCapacitacion ? 'Apto (Pasar a Gestión)' : '🚫 Gestión (Bloqueado)'}
                        </option>
                    </select>
                </div>
                <label className="flex items-center gap-2 cursor-pointer pt-2">
                  <input 
                    type="checkbox" 
                    checked={!!formData.es_reingreso} // Esto convierte undefined a false automáticamente
                    onChange={(e) => setFormData({...formData, es_reingreso: e.target.checked})} 
                    className="rounded text-indigo-600" 
                  />
                  <span className="text-xs font-bold text-gray-600 uppercase">Es Reingreso</span>
                </label>
              </div>

              <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-100">
                <label className="text-xs font-bold text-amber-700 uppercase mb-2 block">Comentarios del Reclutador</label>
                <textarea 
                  name="comentarios_reclutador"
                  value={formData.comentarios_reclutador || ''}
                  onChange={handleChange}
                  className="w-full border-0 bg-transparent text-sm text-amber-900 placeholder-amber-400 focus:ring-0"
                  rows="4"
                  placeholder="Escriba aquí observaciones del proceso..."
                />
              </div>

            </div>

            {/* Columna Derecha: Formulario */}
            <div className="md:col-span-2 space-y-8">
              <section>
                <h4 className="flex items-center gap-2 font-bold text-gray-900 mb-4">
                  <User size={18} className="text-indigo-600" /> Datos Personales
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-[10px] font-bold text-gray-400 uppercase">Nombres</label><input name="nombres" value={formData.nombres || ''} onChange={handleChange} className="w-full border rounded-xl p-2 text-sm" /></div>
                  <div><label className="text-[10px] font-bold text-gray-400 uppercase">DNI</label><input name="dni" value={formData.dni || ''} onChange={handleChange} className="w-full border rounded-xl p-2 text-sm" /></div>
                  <div><label className="text-[10px] font-bold text-gray-400 uppercase">Apellido Paterno</label><input name="apellido_paterno" value={formData.apellido_paterno || ''} onChange={handleChange} className="w-full border rounded-xl p-2 text-sm" /></div>
                  <div><label className="text-[10px] font-bold text-gray-400 uppercase">Apellido Materno</label><input name="apellido_materno" value={formData.apellido_materno || ''} onChange={handleChange} className="w-full border rounded-xl p-2 text-sm" /></div>
                  <div><label className="text-[10px] font-bold text-gray-400 uppercase">Celular</label><input name="celular" value={formData.celular || ''} onChange={handleChange} className="w-full border rounded-xl p-2 text-sm" /></div>
                  <div><label className="text-[10px] font-bold text-gray-400 uppercase">Turno</label>
                    <select name="horario_interes" value={formData.horario_interes} onChange={handleChange} className="w-full border rounded-xl p-2 text-sm bg-white">
                        <option value="Mañana">Mañana</option><option value="Tarde">Tarde</option><option value="Noche">Noche</option>
                    </select>
                  </div>
                </div>
              </section>

              <section>
                <h4 className="flex items-center gap-2 font-bold text-gray-900 mb-4 text-red-600">
                  <HeartPulse size={18} /> Salud y Emergencia
                </h4>
                <div className="grid grid-cols-1 gap-4 bg-red-50/30 p-5 rounded-3xl border border-red-50">
                  <div><label className="text-[10px] font-bold text-red-400 uppercase">Alergias/Enfermedades</label><input name="enfermedades_alergias" value={formData.enfermedades_alergias || ''} onChange={handleChange} className="w-full border-b border-red-100 bg-transparent py-1 text-sm outline-none" /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-[10px] font-bold text-red-400 uppercase">Contacto</label><input name="emergencia_nombre" value={formData.emergencia_nombre || ''} onChange={handleChange} className="w-full border-b border-red-100 bg-transparent py-1 text-sm outline-none" /></div>
                    <div><label className="text-[10px] font-bold text-red-400 uppercase">Teléfono</label><input name="emergencia_telefono" value={formData.emergencia_telefono || ''} onChange={handleChange} className="w-full border-b border-red-100 bg-transparent py-1 text-sm outline-none" /></div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
          <button type="button" onClick={onClose} className="px-6 py-2 text-sm font-bold text-gray-400">Cancelar</button>
          <button type="submit" className="px-8 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 flex items-center gap-2 transition-all active:scale-95">
            <Save size={18} /> Guardar Cambios
          </button>
        </div>
      </form>
      <ConfirmActionModal 
        show={alerta.show}
        title={alerta.title}
        message={alerta.message}
        variant={alerta.variant}
        onConfirm={alerta.onConfirm}
        onClose={() => setAlerta({ ...alerta, show: false })}
      />
    </div>
  );
};

export default EditarPostulanteModal;