import { useState } from 'react';
import { Fingerprint, Loader2, AlertCircle, ChevronRight } from 'lucide-react';
import { verificarDniPublico } from '@/services/preseleccionService';

const Paso0Acceso = ({ onValidated }) => {
  const [dni, setDni] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleValidar = async () => {
    if (dni.length < 8) {
      setError('El DNI debe tener 8 dígitos.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await verificarDniPublico(dni);
      // res trae: { nombre_completo, puesto_id, puesto: { departamento: { area_general, nombre, id } } }
      onValidated(res);
    } catch (err) {
      setError(err.response?.data?.message || 'DNI no autorizado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500 p-4">
      {/* Logo CK2 */}
      <div className="mb-8 p-4 bg-white rounded-3xl shadow-sm border border-gray-100">
        <img src="/logo_ck2.png" alt="Grupo CK2" className="h-24 w-auto object-contain" />
      </div>

      <div className="text-center space-y-2 mb-8">
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">BIENVENIDO A GRUPO CK2</h2>
        <p className="text-sm text-gray-500 font-medium uppercase tracking-widest">Portal de Selección de Personal</p>
      </div>

      <div className="w-full max-w-sm space-y-4">
        <div className="relative group">
          <Fingerprint className={`absolute left-4 top-4 transition-colors ${loading ? 'text-red-600' : 'text-gray-400 group-focus-within:text-red-600'}`} size={24} />
          <input 
            type="text"
            placeholder="INGRESA TU DNI"
            maxLength={8}
            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:border-red-600 focus:bg-white transition-all text-xl font-black tracking-[0.2em]"
            value={dni}
            onChange={(e) => setDni(e.target.value.replace(/\D/g, ''))}
            onKeyPress={(e) => e.key === 'Enter' && handleValidar()}
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-600 text-[11px] font-black uppercase bg-red-50 p-4 rounded-xl border border-red-100">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <button 
          onClick={handleValidar}
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-red-200 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" /> : <>INGRESAR AL PROCESO <ChevronRight size={20} /></>}
        </button>
      </div>

      <div className="mt-12 flex items-center gap-2">
        <div className="h-1 w-8 bg-red-600 rounded-full"></div>
        <p className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">Ficha de Reclutamiento Oficial</p>
        <div className="h-1 w-8 bg-gray-300 rounded-full"></div>
      </div>
    </div>
  );
};

export default Paso0Acceso;