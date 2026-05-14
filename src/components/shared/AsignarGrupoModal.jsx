import { useState, useEffect } from 'react';
import { getGruposAbiertos, crearGrupo, asignarCandidatosAGrupo } from '../../services/capacitacionService';
import { Users, Calendar, Clock, Plus, ArrowLeft } from 'lucide-react';
import FormularioNuevoGrupo from './FormularioNuevoGrupo';

const AsignarGrupoModal = ({ show, ids, tipo = 'postulante', onClose, onSuccess }) => {
  const [grupos, setGrupos] = useState([]);
  const [grupoId, setGrupoId] = useState("");
  const [creando, setCreando] = useState(false);
  const [loading, setLoading] = useState(false);
  const [nuevoGrupo, setNuevoGrupo] = useState({ 
    nombre_grupo: '', 
    area_general: 'ventas', 
    fecha_capacitacion: '', 
    hora_capacitacion: '',
    tipo: tipo
  });

  useEffect(() => {
    if (show) {
      cargarGrupos();
      setNuevoGrupo({ 
        nombre_grupo: '',
        area_general: 'ventas',
        fecha_capacitacion: '',
        hora_capacitacion: '',
        tipo: tipo 
      });
    } else {
      setCreando(false);
      setGrupoId("");
    }
  }, [show, tipo]);

  const cargarGrupos = async () => {
    try {
    const data = await getGruposAbiertos(tipo);
    setGrupos(data);
    } catch (e) { console.error(e); }
  };

  const handleCrearGrupo = async () => {
    if (!nuevoGrupo.nombre_grupo || !nuevoGrupo.fecha_capacitacion) return alert("Completa el nombre");
    setLoading(true);
    try {
        await crearGrupo(nuevoGrupo);
        setCreando(false);
        setNuevoGrupo({ nombre_grupo: '', area_general: 'ventas', fecha_capacitacion: '', hora_capacitacion: '', tipo: tipo });
        await cargarGrupos();
    } catch (error) {
        alert("Error al crear el grupo");
    } finally {
        setLoading(false);
    }
  };

  const handleSubmit = async () => {
    // Validación de seguridad
    if (!grupoId) return alert("Selecciona un grupo primero");
    if (!ids || ids.length === 0) {
      console.error("IDs no recibidos en el modal:", ids);
      return alert("No hay elementos seleccionados");
    }

    setLoading(true);
    try {
      // DEBUG: Abre la consola (F12) y verifica que esto no sea undefined
      console.log("Enviando a asignar:", { grupoId, ids, tipo });

      // IMPORTANTE: Asegúrate de que asignarCandidatosAGrupo reciba los 3 parámetros
      await asignarCandidatosAGrupo(grupoId, ids, tipo); 
      
      onSuccess();
      onClose();
    } catch (e) {
      console.error("Error detallado:", e.response?.data);
      alert("Error al asignar: " + (e.response?.data?.message || "Error desconocido"));
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg p-8 animate-in zoom-in-95 duration-300 border border-slate-100">
        
        {/* Header con estilo dinámico */}
        <div className="flex items-center gap-4 mb-8">
          <div className="p-4 bg-red-50 text-red-600 rounded-2xl shadow-sm">
            <Users size={28} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900 leading-tight">Asignar a Grupo</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
            {ids?.length || 0} {tipo === 'preseleccion' ? 'Invitados' : 'Postulantes'} seleccionados
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Seleccionar Horario Activo
            </label>
            {!creando && (
              <button 
                onClick={() => setCreando(true)}
                className="text-[10px] font-black text-red-600 hover:text-red-700 flex items-center gap-1 uppercase transition-colors"
              >
                <Plus size={14} strokeWidth={3} /> Nuevo Grupo
              </button>
            )}
          </div>

          <div className="max-h-[350px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
          {creando ? (
              <FormularioNuevoGrupo 
                nuevoGrupo={nuevoGrupo}
                setNuevoGrupo={setNuevoGrupo}
                onBack={() => setCreando(false)}
                onSave={handleCrearGrupo}
                tipo={tipo}
                loading={loading}
              />
            ) : (
            grupos.length > 0 ? grupos.map(g => (
              <button
                key={g.id}
                onClick={() => setGrupoId(g.id)}
                className={`w-full p-5 rounded-3xl border-2 text-left transition-all flex items-center justify-between group ${grupoId === g.id ? 'border-red-600 bg-red-50/50 shadow-md shadow-red-100' : 'border-slate-100 hover:border-slate-200 bg-white'}`}
              >
                <div>
                  <div className={`font-black text-sm uppercase tracking-tight ${grupoId === g.id ? 'text-red-700' : 'text-slate-800'}`}>{g.nombre_grupo}</div>
                  <div className={`text-[10px] font-black uppercase mt-1 ${grupoId === g.id ? 'text-red-500' : 'text-slate-400'}`}>{g.area_general}</div>
                </div>
                <div className="text-right space-y-1">
                  <div className="flex items-center gap-1.5 justify-end text-[10px] font-bold text-slate-500"><Calendar size={12} className="text-red-400"/> {g.fecha_capacitacion}</div>
                  <div className="flex items-center gap-1.5 justify-end text-[10px] font-bold text-slate-500"><Clock size={12} className="text-red-400"/> {g.hora_capacitacion}</div>
                </div>
              </button>
            )) : (
              <div className="text-center py-10 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No hay grupos para {tipo}</p>
              </div>
            )
          )}
          </div>
        </div>

        {/* Acciones */}
        <div className="flex gap-4 mt-10">
          <button onClick={onClose} className="flex-1 py-4 rounded-2xl text-xs font-black uppercase text-slate-400 hover:bg-slate-50 transition-all">
            Cancelar
          </button>
          <button 
            onClick={handleSubmit}
            disabled={loading || !grupoId}
            className="flex-[2] py-4 rounded-2xl text-xs font-black uppercase bg-red-600 text-white shadow-xl shadow-red-200 hover:bg-red-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {loading ? "Procesando..." : "Confirmar Selección"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AsignarGrupoModal;