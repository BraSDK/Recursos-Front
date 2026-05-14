import { Mail, Phone, MapPin, Smartphone } from 'lucide-react';

const Paso2Contacto = ({ data, setData, onNext, onBack }) => {

  // Función de validación (adelantándonos a tu necesidad futura)
  const handleNext = () => {
    // Si en el futuro quieres obligatorios, harías algo como:
    // if (!data.email || !data.celular || !data.direccion) {
    //   alert("Por favor llena los campos obligatorios");
    //   return;
    // }
    
    // El telefono_fijo al no estar en la validación, pasaría como null/undefined sin problemas
    onNext();
  };

  return (
    <div className="space-y-5">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-900">Contacto</h3>
        <p className="text-sm text-gray-500">¿Dónde podemos localizarte?</p>
      </div>

      <div className="space-y-4">
        {/* Email */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-red-400 uppercase ml-1">Correo Electrónico</label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
            <input 
              type="email" 
              placeholder="correo@ejemplo.com"
              className="w-full pl-10 pr-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-red-500 transition-all"
              value={data.email || ''}
              onChange={(e) => setData({...data, email: e.target.value})}
            />
          </div>
        </div>

        {/* Celular (Ahora ocupa todo el ancho al quitar el fijo) */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-red-400 uppercase ml-1">Número de Celular</label>
          <div className="relative">
            <Smartphone className="absolute left-3 top-3 text-gray-400" size={20} />
            <input 
              type="text" 
              inputMode="numeric"
              maxLength={9}
              placeholder="999 999 999"
              className="w-full pl-10 pr-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-red-500 transition-all"
              value={data.celular || ''}
              onChange={(e) => {
                // Reemplaza cualquier cosa que no sea un número por un string vacío
                const val = e.target.value.replace(/\D/g, ''); 
                setData({...data, celular: val});
              }}
            />
          </div>
        </div>

        {/* Dirección Actual */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-red-400 uppercase ml-1">Dirección de Domicilio</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Av. Las Flores 123..."
              className="w-full pl-10 pr-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-red-500 transition-all"
              value={data.direccion || ''}
              onChange={(e) => setData({...data, direccion: e.target.value})}
            />
          </div>
        </div>
        
        {/* Distrito */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-red-400 uppercase ml-1">Distrito</label>
          <input 
            type="text" 
            placeholder="Ej. Los Olivos"
            className="w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-red-500 transition-all"
            value={data.distrito || ''}
            onChange={(e) => setData({...data, distrito: e.target.value})}
          />
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button 
          onClick={onBack} 
          className="flex-1 py-4 text-gray-500 font-semibold hover:bg-gray-100 rounded-2xl transition-all"
        >
          Atrás
        </button>
        <button 
          onClick={handleNext} // Usamos la función de control
          className="flex-1 bg-red-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-red-700 active:scale-95 transition-all"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default Paso2Contacto;