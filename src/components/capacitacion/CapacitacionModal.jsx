import React, { useEffect, useState } from 'react';
import { X, Save, Trash2, Info, Users, Loader2, UserMinus } from 'lucide-react';
import { getGrupoById } from '@/services/capacitacionService';
import ConfirmModal from '@/components/shared/ConfirmModal';

const CapacitacionModal = ({ show, onClose, onSave, onDelete, initialData }) => {
  const [activeTab, setActiveTab] = useState('info'); // 'info' o 'inscritos'
  const [postulantes, setPostulantes] = useState([]);
  const [loadingInscritos, setLoadingInscritos] = useState(false);
  const [formData, setFormData] = useState({
    nombre_grupo: '',
    area_general: 'ventas',
    fecha_capacitacion: '',
    hora_capacitacion: '',
    estado: 'abierto',
    tipo: 'postulante'
  });

  // ESTADOS PARA EL MODAL DE CONFIRMACIÓN
  const [confirmConfig, setConfirmConfig] = useState({
    show: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      // Solo cargamos los inscritos si estamos editando un grupo existente 
      if (initialData.id) {
        cargarInscritos(initialData.id);
      }
    } else {
      setFormData({
        nombre_grupo: '',
        area_general: 'ventas',
        fecha_capacitacion: '',
        hora_capacitacion: '',
        estado: 'abierto',
        tipo: 'postulante'
      });
      setPostulantes([]);
      setActiveTab('info');
    }
  }, [initialData, show]);

  const cargarInscritos = async (grupoId) => {
    setLoadingInscritos(true);
    try {
      const data = await getGrupoById(grupoId);
      setPostulantes(data.inscritos || []);
    } catch (error) {
      console.error("Error al cargar inscritos:", error);
      alert("No se pudieron cargar los inscritos del grupo.");
    } finally {
      setLoadingInscritos(false);
    }
  };

  // 1. Confirmar eliminar GRUPO completo
  const handleConfirmDeleteGrupo = () => {
    setConfirmConfig({
      show: true,
      title: '¿Eliminar Horario?',
      message: `¿Estás seguro de eliminar "${formData.nombre_grupo}"? Todos los candidatos asignados quedarán sin horario.`,
      onConfirm: () => {
        onDelete(formData.id);
        setConfirmConfig(prev => ({ ...prev, show: false }));
      }
    });
  };

  // Quitar a UN postulante del grupo
  const handleConfirmDesvincular = (postulante) => {
    setConfirmConfig({
      show: true,
      title: 'Quitar Candidato',
      message: `¿Deseas quitar a ${postulante.nombres} de este grupo?`,
      onConfirm: async () => {
        // Llamamos a la función que viene por props
        await onDesvincular(formData.id, postulante.id);
        // Recargamos la lista localmente
        cargarInscritos(formData.id);
        setConfirmConfig(prev => ({ ...prev, show: false }));
      }
    });
  };

  if (!show) return null;

  return (
    <>
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

        {/* Header */}
        <div className="p-8 border-b flex justify-between items-center bg-slate-50/50">
            <div>
              <h3 className="text-xl font-black text-slate-800">
                {formData.id ? 'Gestionar Capacitación' : 'Nueva Capacitación'}
              </h3>
              {formData.id && (
                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-1">
                  Módulo: {formData.tipo === 'preseleccion' ? 'Pre-Selección' : 'Reclutamiento'}
                </p>
              )}
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-200/50 rounded-full text-slate-400 transition-colors">
              <X size={24} strokeWidth={2.5} />
            </button>
        </div>

        {/* TABS (Solo se muestran si el grupo ya existe) */}
        {formData?.id && (
          <div className="flex px-6 pt-2 border-b border-slate-100 gap-6">
            <button 
              onClick={() => setActiveTab('info')}
              className={`pb-3 font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'info' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <Info size={16} /> Información
              {activeTab === 'info' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-t-full" />}
            </button>
            <button 
              onClick={() => setActiveTab('inscritos')}
              className={`pb-3 font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'inscritos' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <Users size={16} /> Inscritos
              <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-[10px] ml-1">{postulantes.length}</span>
              {activeTab === 'inscritos' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-t-full" />}
            </button>
          </div>
        )}

        {/* CUERPO DEL MODAL */}
        <div className="p-8 max-h-[55vh] overflow-y-auto custom-scrollbar">
          
          {/* ---- PESTAÑA: INFORMACIÓN ---- */}
          {activeTab === 'info' && (
            <form id="grupo-form" className="space-y-4" onSubmit={(e) => { e.preventDefault(); onSave(formData); }}>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Nombre del Grupo</label>
                <input 
                  required
                  className="w-full border border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all text-sm font-medium"
                  value={formData.nombre_grupo || ''}
                  onChange={(e) => setFormData({...formData, nombre_grupo: e.target.value})}
                  placeholder="Ej: Inducción Ventas Mayo"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Área</label>
                  <select 
                    className="w-full border border-slate-200 rounded-xl p-3 outline-none text-sm font-medium bg-white"
                    value={formData.area_general}
                    onChange={(e) => setFormData({...formData, area_general: e.target.value})}
                  >
                    <option value="ventas">Ventas</option>
                    <option value="operaciones">Operaciones</option>
                    <option value="administracion">Administración</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Estado</label>
                  <select 
                    className="w-full border border-slate-200 rounded-xl p-3 outline-none text-sm font-medium bg-white"
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
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Fecha</label>
                  <input 
                    type="date"
                    required
                    className="w-full border border-slate-200 rounded-xl p-3 outline-none text-sm font-medium text-slate-700"
                    value={formData.fecha_capacitacion}
                    onChange={(e) => setFormData({...formData, fecha_capacitacion: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Hora</label>
                  <input 
                    type="time"
                    required
                    className="w-full border border-slate-200 rounded-xl p-3 outline-none text-sm font-medium text-slate-700"
                    value={formData.hora_capacitacion}
                    onChange={(e) => setFormData({...formData, hora_capacitacion: e.target.value})}
                  />
                </div>
              </div>
            </form>
          )}

          {/* ---- PESTAÑA: INSCRITOS ---- */}
          {activeTab === 'inscritos' && (
            <div className="space-y-3">
              {loadingInscritos ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                  <Loader2 className="animate-spin mb-3 text-indigo-500" size={32} />
                  <p className="text-xs font-bold uppercase tracking-widest">Sincronizando lista...</p>
                </div>
              ) : postulantes.length > 0 ? (
                postulantes.map((postulante) => {
                  const nombre = postulante.nombre_completo || postulante.nombres || 'Sin Nombre';
                  const apellidoPaterno = postulante.apellido_paterno || '';
                  //const iniciales = `${nombre.charAt(0)}${apellidoPaterno.charAt(0)}`.toUpperCase();

                  let iniciales = "";
                  if (postulante.nombre_completo) {
                    const partes = postulante.nombre_completo.split(" ");
                    iniciales = partes.length > 1 
                      ? (partes[0][0] + partes[1][0]).toUpperCase() 
                      : partes[0].substring(0, 2).toUpperCase();
                  } else {
                    iniciales = `${nombre.charAt(0)}${apellidoPaterno.charAt(0)}`.toUpperCase();
                  }

                  return (
                    <div key={postulante.id} className="flex items-center justify-between p-4 border-2 border-slate-50 rounded-[1.5rem] bg-slate-50/30 hover:bg-white hover:border-indigo-100 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-black text-xs">
                          {iniciales}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-slate-800">
                            {nombre} {apellidoPaterno} {postulante.apellido_materno || ''}
                          </p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">
                            DNI: {postulante.dni || '---'}
                          </p>
                        </div>
                      </div>
                      {/* IMPORTANTE: No olvides este botón si quieres poder quitarlos */}
                      <button 
                        onClick={() => handleConfirmDesvincular(postulante)}
                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <UserMinus size={20} strokeWidth={2.5} />
                      </button>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12">
                  <Users size={28} className="mx-auto mb-4 text-slate-300" />
                  <p className="font-black text-slate-600 uppercase text-xs tracking-wider">Sin candidatos</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Este horario está disponible</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {activeTab === 'info' && (
            <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex gap-4">
              {formData.id && (
                <button type="button" onClick={handleConfirmDeleteGrupo} className="flex-1 bg-white border-2 border-red-100 text-red-600 font-black text-xs uppercase py-4 rounded-2xl hover:bg-red-50 transition-all flex items-center justify-center gap-2">
                  <Trash2 size={18} /> Eliminar
                </button>
              )}
              <button type="submit" form="grupo-form" className="flex-[2] bg-indigo-600 text-white font-black text-xs uppercase py-4 rounded-2xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-indigo-100">
                <Save size={18} /> {formData.id ? 'Actualizar Horario' : 'Crear Horario'}
              </button>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal 
        show={confirmConfig.show}
        title={confirmConfig.title}
        message={confirmConfig.message}
        onClose={() => setConfirmConfig(prev => ({ ...prev, show: false }))}
        onConfirm={confirmConfig.onConfirm}
      />
    </>
  );
};

export default CapacitacionModal;