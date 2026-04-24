import { useState, useEffect } from 'react';
import { getGruposAbiertos, crearGrupo, asignarPostulantesAGrupo } from '../../services/capacitacionService';
import { Users, Calendar, Clock, Plus } from 'lucide-react';

const AsignarGrupoModal = ({ show, postulanteIds, onClose, onSuccess }) => {
  const [grupos, setGrupos] = useState([]);
  const [grupoId, setGrupoId] = useState("");
  const [loading, setLoading] = useState(false);
  const [creando, setCreando] = useState(false);
  const [nuevoGrupo, setNuevoGrupo] = useState({ nombre_grupo: '', area_general: 'ventas', fecha_capacitacion: '', hora_capacitacion: '' });

  useEffect(() => {
    if (show) {
      cargarGrupos();
    } else {
      // Cuando show pasa a false (se cierra el modal), limpiamos
      setCreando(false);
      setGrupoId("");
      setNuevoGrupo({ 
        nombre_grupo: '', 
        area_general: 'ventas', 
        fecha_capacitacion: '', 
        hora_capacitacion: '' 
      });
    }
  }, [show]);

  const cargarGrupos = async () => {
    const data = await getGruposAbiertos();
    setGrupos(data);
  };

  const handleCrearGrupo = async () => {
    if (!nuevoGrupo.nombre_grupo) return alert("Completa el nombre");
    setLoading(true); // Reutilizamos el estado de carga
    try {
        await crearGrupo(nuevoGrupo);
        setCreando(false);
        setNuevoGrupo({ nombre_grupo: '', area_general: 'ventas', fecha_capacitacion: '', hora_capacitacion: '' });
        await cargarGrupos();
    } catch (error) {
        alert("Error al crear el grupo");
    } finally {
        setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    await asignarPostulantesAGrupo(grupoId, postulanteIds);
    onSuccess();
    onClose();
    setLoading(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 animate-in zoom-in-95 duration-300 border border-gray-100">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
            <Users size={24} />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-gray-900">Asignar a Capacitación</h3>
            <p className="text-sm text-gray-500 font-medium">Gestionando {postulanteIds.length} postulantes</p>
          </div>
        </div>

        {/* Selección */}
        <div className="space-y-4">
          <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest">
            Seleccionar Grupo Activo
          </label>

          {/* Botón para alternar modo creación */}
          {!creando && (
            <button 
              onClick={() => setCreando(true)}
              className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 uppercase"
            >
              <Plus size={12} /> Nuevo Grupo
            </button>
          )}
          
          <div className="grid gap-3">
          {/* MODO CREACIÓN */}
          {creando ? (
            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 animate-in fade-in duration-300">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold text-sm">Nuevo Grupo</h4>
                    <button onClick={() => setCreando(false)} className="text-[10px] font-bold text-gray-400 hover:text-gray-600 uppercase">← Volver</button>
                </div>
            
                <input 
                    placeholder="Nombre del grupo" 
                    className="w-full p-3 rounded-xl border mb-3 text-sm"
                    onChange={e => setNuevoGrupo({...nuevoGrupo, nombre_grupo: e.target.value})}
                />
                
                <div className="flex gap-2 mb-3">
                    <input 
                        type="date" 
                        // Esto bloquea fechas pasadas usando la fecha de hoy
                        min={new Date().toISOString().split('T')[0]} 
                        className="w-1/2 p-2 rounded-xl border text-sm" 
                        onChange={e => setNuevoGrupo({...nuevoGrupo, fecha_capacitacion: e.target.value})} 
                    />
                    <input 
                        type="time" 
                        className="w-1/2 p-2 rounded-xl border text-sm" 
                        onChange={e => setNuevoGrupo({...nuevoGrupo, hora_capacitacion: e.target.value})} 
                    />
                </div>
            
                <select 
                    className="w-full p-2 rounded-xl border mb-3 text-sm" 
                    onChange={e => setNuevoGrupo({...nuevoGrupo, area_general: e.target.value})}
                >
                    <option value="ventas">Ventas</option>
                    <option value="operaciones">Operaciones</option>
                    <option value="administracion">Administración</option>
                </select>
                
                <button 
                    onClick={handleCrearGrupo} 
                    className="w-full bg-green-600 text-white py-2 rounded-xl font-bold text-sm hover:bg-green-700"
                >
                    Guardar Grupo
                </button>
            </div>
          ) : (
            /* MODO LISTA */
            grupos.length > 0 ? grupos.map(g => (
              <button
                key={g.id}
                onClick={() => setGrupoId(g.id)}
                className={`w-full p-4 rounded-2xl border-2 text-left transition-all flex items-center justify-between ${grupoId === g.id ? 'border-indigo-600 bg-indigo-50' : 'border-gray-100 hover:border-gray-200'}`}
              >
                <div>
                  <div className="font-bold text-gray-900">{g.nombre_grupo}</div>
                  <div className="text-[11px] font-bold text-indigo-500 uppercase">{g.area_general}</div>
                </div>
                <div className="text-right text-[10px] text-gray-400">
                  <div className="flex items-center gap-1 justify-end"><Calendar size={12}/> {g.fecha_capacitacion}</div>
                  <div className="flex items-center gap-1 justify-end"><Clock size={12}/> {g.hora_capacitacion}</div>
                </div>
              </button>
            )) : (
              <p className="text-center text-sm text-gray-400 py-4">No hay grupos abiertos disponibles.</p>
            )
          )}
        </div>
      </div>

        {/* Acciones */}
        <div className="flex gap-3 mt-8">
          <button onClick={onClose} className="flex-1 py-3.5 rounded-2xl text-sm font-bold text-gray-500 hover:bg-gray-100 transition-all">
            Cancelar
          </button>
          <button 
            onClick={handleSubmit}
            disabled={loading || !grupoId}
            className="flex-[2] py-3.5 rounded-2xl text-sm font-bold bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 disabled:opacity-50 transition-all"
          >
            {loading ? "Procesando..." : "Confirmar Asignación"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AsignarGrupoModal;