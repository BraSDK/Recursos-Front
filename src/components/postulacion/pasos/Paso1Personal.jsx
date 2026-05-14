import { Fingerprint, User, Calendar, Map, Heart } from 'lucide-react';

const Paso1Personal = ({ data, setData, onNext }) => {

  // 1. Calculamos la fecha límite (Hace 18 años a partir de hoy)
  const getMaxDate = () => {
    const hoy = new Date();
    const max = new Date(hoy.getFullYear() - 18, hoy.getMonth(), hoy.getDate());
    return max.toISOString().split("T")[0]; // Retorna YYYY-MM-DD
  };

  const calcularEdad = (fechaNacimiento) => {
    if (!fechaNacimiento) return '';
    const hoy = new Date();
    const cumple = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - cumple.getFullYear();
    const m = hoy.getMonth() - cumple.getMonth();

    //Ajuste por si aun no ha cumplido años en el año actual
    if (m < 0 || (m === 0 && hoy.getDate() < cumple.getDate())) {
      edad--;
    }
    return edad;
  }

  const handleDateChange = (e) => {
    const fecha = e.target.value;
    const edadCalculada = calcularEdad(fecha);

    setData({ 
      ...data,
      fecha_nacimiento: fecha,
      edad:edadCalculada });
  };

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
            className="w-full pl-10 pr-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-red-500"
            value={data.dni || ''}
            onChange={(e) => setData({...data, dni: e.target.value})}
          />
        </div>

        {/* Nombres */}
        <input 
          type="text" placeholder="Nombres"
          className="w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-red-500"
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

        {/* Fecha de Nacimiento */}
        <div className="space-y-1">
          <label className="text-[10px] font-black text-red-600 ml-1 tracking-widest uppercase">Fecha de Nacimiento</label>
          <div className="relative group">
            <Calendar className="absolute left-3 top-3 text-gray-400 group-focus-within:text-red-500 transition-colors" size={20} />
            <input 
              type="date"
              max={getMaxDate()} // <-- Aquí bloqueamos años futuros y menores de edad
              className="w-full pl-10 pr-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-red-500 text-gray-600 bg-white cursor-pointer appearance-none"
              value={data.fecha_nacimiento || ''}
              onChange={handleDateChange}
              style={{ colorScheme: 'light' }} // Mejora el look del picker en algunos navegadores
            />
          </div>
          <p className="text-[10px] text-gray-400 mt-1 ml-1">* Debes ser mayor de 18 años para postular.</p>
        </div>

        {/* Sexo y Edad */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Sexo</label>
            <select 
              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-red-500 text-sm"
              value={data.sexo || ''}
              onChange={(e) => setData({...data, sexo: e.target.value})}
              required
            >
              <option value="">Seleccionar</option>
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
              <option value="O">Otro / No binario</option> {/* Requiere cambio en DB */}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Edad</label>
            <input 
              type="number" 
              placeholder="Edad"
              readOnly // <-- Evita edición manual
              className="w-full px-4 py-3 border border-gray-100 rounded-xl bg-gray-50 text-gray-500 outline-none cursor-not-allowed font-bold"
              value={data.edad || ''}
            />
          </div>
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
        className="w-full bg-red-600 text-white font-bold py-4 rounded-2xl shadow-lg mt-4 active:scale-95 transition-transform"
      >
        Siguiente
      </button>
    </div>
  );
};

export default Paso1Personal;