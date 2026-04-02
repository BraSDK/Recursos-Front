import { HeartPulse, AlertCircle, Send, Users, Activity, HelpCircle } from 'lucide-react';

const Paso5Adicionales = ({ data, setData, onConfirm, onBack, loading }) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-900">Últimos Detalles</h3>
        <p className="text-sm text-gray-500">Información complementaria y de seguridad.</p>
      </div>

      <div className="space-y-4">
        {/* Sección Familia */}
        <div className="bg-indigo-50/50 p-4 rounded-3xl border border-indigo-100 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users size={20} className="text-indigo-600" />
              <span className="text-sm font-semibold text-gray-700">¿Tiene hijos?</span>
            </div>
            <input 
              type="checkbox" className="w-6 h-6 rounded-lg accent-indigo-600"
              checked={data.tiene_hijos || false}
              onChange={(e) => setData({...data, tiene_hijos: e.target.checked, cantidad_hijos: e.target.checked ? data.cantidad_hijos : 0})}
            />
          </div>

          {data.tiene_hijos && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="text-[10px] font-bold text-indigo-400 uppercase ml-1">¿Cuántos hijos tiene?</label>
              <input 
                type="number"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                value={data.cantidad_hijos || ''}
                onChange={(e) => setData({...data, cantidad_hijos: e.target.value})}
              />
            </div>
          )}

          {data.sexo === 'F' && (
            <div className="flex items-center justify-between pt-2 border-t border-indigo-100">
              <span className="text-sm font-semibold text-gray-700">¿Está embarazada?</span>
              <input 
                type="checkbox" className="w-6 h-6 rounded-lg accent-pink-500"
                checked={data.esta_embarazada || false}
                onChange={(e) => setData({...data, esta_embarazada: e.target.checked})}
              />
            </div>
          )}
        </div>

        {/* Sección Salud */}
        <div className="space-y-1">
          <label className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase ml-1">
            <Activity size={14} /> Enfermedades o Alergias
          </label>
          <textarea 
            placeholder="Si no tiene, puede dejarlo en blanco..."
            className="w-full px-4 py-3 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 min-h-[80px] text-sm"
            value={data.enfermedades_alergias || ''}
            onChange={(e) => setData({...data, enfermedades_alergias: e.target.value})}
          />
        </div>

        {/* Contacto de Emergencia */}
        <div className="p-5 bg-red-50/50 rounded-3xl border border-red-100 space-y-3">
          <p className="flex items-center gap-2 text-[10px] font-bold text-red-600 uppercase tracking-wider">
            <AlertCircle size={14} /> Contacto de Emergencia
          </p>
          <input 
            placeholder="Nombre completo"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-red-400 bg-white"
            value={data.emergencia_nombre || ''}
            onChange={(e) => setData({...data, emergencia_nombre: e.target.value})}
          />
          <div className="grid grid-cols-2 gap-3">
            <input 
              placeholder="Parentesco"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-red-400 bg-white"
              value={data.emergencia_parentesco || ''}
              onChange={(e) => setData({...data, emergencia_parentesco: e.target.value})}
            />
            <input 
              placeholder="Teléfono"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-red-400 bg-white"
              value={data.emergencia_telefono || ''}
              onChange={(e) => setData({...data, emergencia_telefono: e.target.value})}
            />
          </div>
        </div>

        {/* Motivo Laborar - OBLIGATORIO */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">¿Por qué desea laborar con nosotros?</label>
          <textarea 
            className="w-full px-4 py-3 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 min-h-[80px]"
            value={data.motivo_laborar || ''}
            onChange={(e) => setData({...data, motivo_laborar: e.target.value})}
            required
          />
        </div>

        {/* Horario Interés - OBLIGATORIO */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Turno de Interés</label>
          <select 
            className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-indigo-500"
            value={data.horario_interes || ''}
            onChange={(e) => setData({...data, horario_interes: e.target.value})}
            required
          >
            <option value="">Selecciona turno</option>
            <option value="Mañana">Mañana</option>
            <option value="Tarde">Tarde</option>
            <option value="Noche">Noche</option>
          </select>
        </div>
      </div>

      {/* Botones de Acción */}
      <div className="flex gap-3 pt-4">
        <button 
          onClick={onBack} 
          disabled={loading}
          className="flex-1 py-4 text-gray-500 font-semibold hover:bg-gray-100 rounded-2xl transition-all disabled:opacity-50"
        >
          Atrás
        </button>
        <button 
          onClick={onConfirm}
          disabled={loading}
          className="flex-1 bg-indigo-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all disabled:bg-indigo-300"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Enviando...
            </span>
          ) : (
            <>Finalizar Registro <Send size={18} /></>
          )}
        </button>
      </div>
    </div>
  );
};

export default Paso5Adicionales;