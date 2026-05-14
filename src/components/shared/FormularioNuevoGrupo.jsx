import React from 'react';
import { ArrowLeft, Calendar, Clock, Briefcase } from 'lucide-react';

const FormularioNuevoGrupo = ({ nuevoGrupo, setNuevoGrupo, onBack, onSave, tipo, loading }) => {
  return (
    <div className="bg-slate-50 p-6 rounded-3xl border-2 border-slate-100 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h4 className="font-black text-slate-800 uppercase text-xs tracking-wider">Nuevo Horario</h4>
          <span className="text-[10px] font-bold text-red-500 uppercase tracking-tighter">
            Módulo: {tipo === 'preseleccion' ? 'Pre-Selección' : 'Reclutamiento'}
          </span>
        </div>
        <button onClick={onBack} className="text-[10px] font-black text-slate-400 hover:text-slate-600 flex items-center gap-1 uppercase">
          <ArrowLeft size={12} /> Volver
        </button>
      </div>

      <div className="space-y-3">
        <input 
          placeholder="Ej. Grupo Mañana - Ventas" 
          className="w-full p-4 rounded-2xl border-2 border-slate-100 text-sm font-bold focus:border-red-500 outline-none transition-all"
          value={nuevoGrupo.nombre_grupo}
          onChange={e => setNuevoGrupo({...nuevoGrupo, nombre_grupo: e.target.value})}
        />
        
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <input 
              type="date" 
              min={new Date().toISOString().split('T')[0]} 
              className="w-full p-3 rounded-2xl border-2 border-slate-100 text-sm font-bold focus:border-red-500 outline-none transition-all" 
              value={nuevoGrupo.fecha_capacitacion}
              onChange={e => setNuevoGrupo({...nuevoGrupo, fecha_capacitacion: e.target.value})} 
            />
          </div>
          <div className="flex-1">
            <input 
              type="time" 
              className="w-full p-3 rounded-2xl border-2 border-slate-100 text-sm font-bold focus:border-red-500 outline-none transition-all" 
              value={nuevoGrupo.hora_capacitacion}
              onChange={e => setNuevoGrupo({...nuevoGrupo, hora_capacitacion: e.target.value})} 
            />
          </div>
        </div>

        <select 
          className="w-full p-3 rounded-2xl border-2 border-slate-100 text-sm font-bold focus:border-red-500 outline-none transition-all appearance-none bg-white" 
          value={nuevoGrupo.area_general}
          onChange={e => setNuevoGrupo({...nuevoGrupo, area_general: e.target.value})}
        >
          <option value="ventas">Ventas</option>
          <option value="operaciones">Operaciones</option>
          <option value="administracion">Administración</option>
        </select>
        
        <button 
          onClick={onSave} 
          disabled={loading}
          className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 disabled:opacity-50"
        >
          {loading ? "Guardando..." : "Guardar y Listar"}
        </button>
      </div>
    </div>
  );
};

export default FormularioNuevoGrupo;