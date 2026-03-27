import { Fingerprint, User, Calendar, Map, Heart } from 'lucide-react';

const Paso1Personal = ({ data, setData, onNext }) => {
  return (
    <div className="space-y-5">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-900">Datos Personales</h3>
        <p className="text-sm text-gray-500">Información básica de identidad.</p>
      </div>

      <div className="space-y-4">
        {/* DNI */}
        <div className="relative">
          <Fingerprint className="absolute left-3 top-3 text-gray-400" size={20} />
          <input 
            type="text" placeholder="DNI"
            className="w-full pl-10 pr-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
            value={data.dni || ''}
            onChange={(e) => setData({...data, dni: e.target.value})}
          />
        </div>

        {/* Nombres */}
        <input 
          type="text" placeholder="Nombres"
          className="w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
          value={data.nombres || ''}
          onChange={(e) => setData({...data, nombres: e.target.value})}
        />

        {/* Apellidos */}
        <div className="grid grid-cols-2 gap-4">
          <input 
            type="text" placeholder="Ap. Paterno"
            className="w-full px-4 py-3 border rounded-xl outline-none"
            value={data.apellido_paterno || ''}
            onChange={(e) => setData({...data, apellido_paterno: e.target.value})}
          />
          <input 
            type="text" placeholder="Ap. Materno"
            className="w-full px-4 py-3 border rounded-xl outline-none"
            value={data.apellido_materno || ''}
            onChange={(e) => setData({...data, apellido_materno: e.target.value})}
          />
        </div>

        {/* Fecha de Nacimiento (FALTABA) */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-400 ml-1">FECHA DE NACIMIENTO</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 text-gray-400" size={20} />
            <input 
              type="date"
              className="w-full pl-10 pr-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-gray-600"
              value={data.fecha_nacimiento || ''}
              onChange={(e) => setData({...data, fecha_nacimiento: e.target.value})}
            />
          </div>
        </div>

        {/* Sexo y Edad */}
        <div className="grid grid-cols-2 gap-4">
          <select 
            className="w-full px-4 py-3 border rounded-xl bg-white outline-none"
            value={data.sexo || ''}
            onChange={(e) => setData({...data, sexo: e.target.value})}
          >
            <option value="">Sexo</option>
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
          </select>
          <input 
            type="number" placeholder="Edad"
            className="w-full px-4 py-3 border rounded-xl outline-none"
            value={data.edad || ''}
            onChange={(e) => setData({...data, edad: e.target.value})}
          />
        </div>

        {/* Estado Civil y Ubigeo (FALTABAN) */}
        <div className="grid grid-cols-2 gap-4">
          <select 
            className="w-full px-4 py-3 border rounded-xl bg-white outline-none"
            value={data.estado_civil || ''}
            onChange={(e) => setData({...data, estado_civil: e.target.value})}
          >
            <option value="">Est. Civil</option>
            <option value="Soltero">Soltero(a)</option>
            <option value="Casado">Casado(a)</option>
            <option value="Divorciado">Divorciado(a)</option>
            <option value="Viudo">Viudo(a)</option>
          </select>
          <div className="relative">
            <Map className="absolute left-3 top-3 text-gray-400" size={18} />
            <input 
              type="text" placeholder="Dep / Prov"
              className="w-full pl-9 pr-4 py-3 border rounded-xl outline-none"
              value={data.ubigeo_dep_prov || ''}
              onChange={(e) => setData({...data, ubigeo_dep_prov: e.target.value})}
            />
          </div>
        </div>
      </div>

      <button 
        onClick={onNext}
        className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl shadow-lg mt-4 active:scale-95 transition-transform"
      >
        Siguiente
      </button>
    </div>
  );
};

export default Paso1Personal;