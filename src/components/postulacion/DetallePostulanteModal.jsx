import { X, User, Briefcase, GraduationCap, Phone, HeartPulse, Camera, FileText, ExternalLink, Maximize2 } from "lucide-react";
import { estadoColors, turnoColors } from '@/constants/reclutamiento';
import { useState } from "react";

const DetallePostulanteModal = ({ show, onClose, postulante, onUpdateFoto }) => {
  const [uploading, setUploading] = useState(false);
  const [showCV, setShowCV] = useState(false);

  if (!show || !postulante) return null;

  const handleFotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploading(true);
    await onUpdateFoto(postulante.id, file);
    setUploading(false);
  };

  // URL del archivo
  const pdfUrl = `http://sistema-rrhh.test/storage/${postulante.cv_path}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl z-10 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
              <User size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Ficha del Postulante</h3>
              <p className="text-sm text-gray-500">DNI: {postulante.dni}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <X size={24} className="text-gray-400" />
          </button>
        </div>

        {/* Cuerpo con Scroll */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Columna Izquierda: Foto, Estado y CV */}
            <div className="space-y-6">
              <div className="relative group mx-auto w-48 h-48">
                <div className="w-full h-full rounded-3xl bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                  {postulante.foto_path ? (
                    <img src={`http://sistema-rrhh.test/storage/${postulante.foto_path}`} className="w-full h-full object-cover" alt="Perfil" />
                  ) : (
                    <User size={64} className="text-gray-300" />
                  )}
                </div>
                {/* Botón para subir foto (Solo personal autorizado) */}
                <label className="absolute bottom-2 right-2 p-3 bg-indigo-600 text-white rounded-2xl cursor-pointer shadow-lg hover:bg-indigo-700 transition-all">
                  <Camera size={20} />
                  <input type="file" className="hidden" onChange={handleFotoChange} disabled={uploading} />
                </label>
              </div>

              {/* Bloque de Estado y CV */}
              <div className="space-y-3">
                <div className="bg-gray-50 p-5 rounded-3xl border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Gestión de Proceso</p>
                  
                  {/* Estado Badge */}
                  <div className={`w-full py-2 px-4 rounded-xl text-center text-sm font-bold uppercase mb-3 ${estadoColors[postulante.estado_proceso] || 'bg-gray-100 text-gray-600'}`}>
                    {postulante.estado_proceso}
                  </div>

                  {/* SECCIÓN DEL CV PROFESIONAL */}
                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Documentación</p>
                    {postulante.cv_path ? (
                    <button 
                      onClick={() => setShowCV(true)} 
                      className="w-full group flex items-center justify-between p-3 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                    >
                      <div className="flex items-center gap-3">
                        <FileText size={18} className="text-indigo-200" />
                        <span className="text-sm font-bold">Ver Currículum</span>
                      </div>
                      <Maximize2 size={16} className="text-indigo-200 group-hover:scale-110 transition-transform" />
                    </button>
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-gray-200 text-gray-500 rounded-2xl opacity-60 italic text-xs">
                      <FileText size={18} /> Sin CV Adjunto
                    </div>
                  )}
                  </div>

                  {postulante.es_reingreso && (
                    <div className="mt-4 p-3 bg-orange-50 border border-orange-100 rounded-xl">
                      <p className="text-[10px] text-orange-600 font-black text-center">⚠️ ALERTA: REINGRESO</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Columna Derecha: Información Detallada */}
            <div className="md:col-span-2 space-y-8">
              {/* Seccion 1: Datos Personales */}
              <section>
                <h4 className="flex items-center gap-2 font-bold text-gray-900 mb-4">
                  <User size={18} className="text-indigo-600" /> Datos Personales
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><p className="text-gray-400">Nombres y Apellidos</p><p className="font-medium">{postulante.nombres} {postulante.apellido_paterno} {postulante.apellido_materno}</p></div>
                  <div><p className="text-gray-400">Edad / Sexo</p><p className="font-medium">{postulante.edad} años / {postulante.sexo}</p></div>
                  <div><p className="text-gray-400">Domicilio</p><p className="font-medium">{postulante.direccion}, {postulante.distrito}</p></div>
                  <div><p className="text-gray-400">Turno Interés</p><p className={`inline-block px-3 ${turnoColors[postulante.horario_interes] || 'bg-gray-50'} uppercase`}>{postulante.horario_interes}</p></div>
                </div>
              </section>

              {/* Seccion 2: Experiencia Laboral (Lo que llenó en el celular) */}
              <section>
                <h4 className="flex items-center gap-2 font-bold text-gray-900 mb-4">
                  <Briefcase size={18} className="text-indigo-600" /> Experiencia Laboral
                </h4>
                <div className="space-y-3">
                  {postulante.experiencia_laboral?.map((exp, i) => (
                    <div key={i} className="p-3 border rounded-xl bg-gray-50/50">
                      <p className="font-bold text-gray-800">{exp.cargo} en {exp.entidad}</p>
                      <p className="text-xs text-gray-500">{exp.inicio} - {exp.fin}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Seccion 3: Salud y Emergencia */}
              <section>
                <h4 className="flex items-center gap-2 font-bold text-gray-900 mb-4">
                  <HeartPulse size={18} className="text-red-600" /> Salud y Emergencia
                </h4>
                <div className="bg-red-50/50 p-4 rounded-2xl border border-red-100">
                  <p className="text-sm text-gray-700"><strong>Enfermedades:</strong> {postulante.enfermedades_alergias || 'Ninguna'}</p>
                  <p className="text-sm text-gray-700 mt-2"><strong>Contacto:</strong> {postulante.emergencia_nombre} ({postulante.emergencia_parentesco}) - {postulante.emergencia_telefono}</p>
                </div>
              </section>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
          <button onClick={onClose} className="px-6 py-2.5 font-semibold text-gray-600 hover:bg-gray-200 rounded-xl transition-all">
            Cerrar Ficha
          </button>
        </div>

        {/* --- VISOR DE PDF FLOTANTE (AL FINAL PARA Z-INDEX) --- */}
        {showCV && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-md" onClick={() => setShowCV(false)} />
            <div className="relative bg-white w-full max-w-5xl h-full rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in duration-300">
              <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                <span className="font-bold text-gray-800 flex items-center gap-2"><FileText size={20} className="text-indigo-600"/> CV: {postulante.nombres}</span>
                <button onClick={() => setShowCV(false)} className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><X size={20}/></button>
              </div>
              <div className="flex-1 bg-gray-100">
                <iframe src={`${pdfUrl}#toolbar=0`} className="w-full h-full border-none" title="Visor CV" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetallePostulanteModal;