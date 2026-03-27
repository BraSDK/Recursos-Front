import { Mail, Phone, MapPin, Smartphone } from 'lucide-react';

const Paso2Contacto = ({ data, setData, onNext, onBack }) => {
  return (
    <div className="space-y-5">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-900">Contacto</h3>
        <p className="text-sm text-gray-500">¿Dónde podemos localizarte?</p>
      </div>

      <div className="space-y-4">
        {/* Email */}
        <div className="relative">
          <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
          <input 
            type="email" 
            placeholder="Correo electrónico"
            className="w-full pl-10 pr-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
            value={data.email || ''}
            onChange={(e) => setData({...data, email: e.target.value})}
          />
        </div>

        {/* Celular y Teléfono Fijo */}
        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <Smartphone className="absolute left-3 top-3 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Celular"
              className="w-full pl-10 pr-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
              value={data.celular || ''}
              onChange={(e) => setData({...data, celular: e.target.value})}
            />
          </div>
          <div className="relative">
            <Phone className="absolute left-3 top-3 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Telf. Fijo"
              className="w-full pl-10 pr-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
              value={data.telefono_fijo || ''}
              onChange={(e) => setData({...data, telefono_fijo: e.target.value})}
            />
          </div>
        </div>

        {/* Dirección Actual */}
        <div className="relative">
          <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Dirección actual"
            className="w-full pl-10 pr-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
            value={data.direccion || ''}
            onChange={(e) => setData({...data, direccion: e.target.value})}
          />
        </div>
        
        {/* Distrito */}
        <div className="relative">
          <input 
            type="text" 
            placeholder="Distrito"
            className="w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
            value={data.distrito || ''}
            onChange={(e) => setData({...data, distrito: e.target.value})}
          />
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button 
          onClick={onBack} 
          className="flex-1 py-4 text-gray-500 font-semibold hover:bg-gray-100 rounded-2xl transition-colors"
        >
          Atrás
        </button>
        <button 
          onClick={onNext} 
          className="flex-1 bg-indigo-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-indigo-700 active:scale-95 transition-all"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default Paso2Contacto;