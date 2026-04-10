import { useState, useEffect } from "react";
import { X, AlertTriangle, Calendar, FileText, CheckCircle2 } from "lucide-react";

const EmpleadoCeseModal = ({ show, onClose, onConfirm, empleadoNombre }) => {
  const [datos, setDatos] = useState({
    motivo_cese: "",
    observaciones: "",
    recontratable: true,
    fecha_salida: new Date().toISOString().split('T')[0]
  });

  // Estado para controlar la renderización de la animación de salida
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    if (show) {
      setIsRendered(true);
    } else {
      // Delay de 200ms para que se vea el efecto de escala antes de desmontar
      const timer = setTimeout(() => setIsRendered(false), 200);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!isRendered && !show) return null;

  return (
      <div className={`fixed inset-0 z-[70] flex items-center justify-center p-4 transition-opacity duration-300 ${
        show ? "opacity-100" : "opacity-0"
      }`}>
        {/* Backdrop con Blur dinámico */}
        <div 
          className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" 
          onClick={onClose} 
        />
        
        {/* Contenedor con Animación Shadcn Style */}
        <div className={`bg-white w-full max-w-lg rounded-3xl shadow-2xl z-10 overflow-hidden transition-all duration-300 transform ${
          show ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}>
          
          {/* Header con el botón X */}
          <div className="relative p-6 border-b border-gray-100 flex items-center gap-4 bg-red-50/50">
            <div className="p-3 bg-red-100 text-red-600 rounded-2xl">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 leading-tight">Dar de Baja Empleado</h3>
              <p className="text-sm text-red-600 font-medium">{empleadoNombre}</p>
            </div>
            
            {/* Botón X posicionado igual al modal de edición */}
            <button 
              onClick={onClose} 
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-md"
            >
              <X size={20} />
            </button>
          </div>

        <div className="p-8 space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Motivo del Cese</label>
            <input 
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-500/20 outline-none transition-all"
              placeholder="Ej: Renuncia voluntaria, término de contrato..."
              value={datos.motivo_cese}
              onChange={(e) => setDatos({...datos, motivo_cese: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Fecha de Salida</label>
              <input 
                type="date"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none"
                value={datos.fecha_salida}
                onChange={(e) => setDatos({...datos, fecha_salida: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">¿Recontratable?</label>
              <button 
                type="button"
                onClick={() => setDatos({...datos, recontratable: !datos.recontratable})}
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border transition-all font-bold ${
                  datos.recontratable 
                  ? "bg-green-50 border-green-200 text-green-700" 
                  : "bg-gray-50 border-gray-200 text-gray-400"
                }`}
              >
                <CheckCircle2 size={18} /> {datos.recontratable ? "SÍ" : "NO"}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Observaciones Finales</label>
            <textarea 
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl h-24 resize-none outline-none"
              placeholder="Detalles adicionales sobre el retiro..."
              value={datos.observaciones}
              onChange={(e) => setDatos({...datos, observaciones: e.target.value})}
            />
          </div>
        </div>

        <div className="p-6 bg-gray-50 border-t flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-2xl hover:bg-gray-50 transition-all shadow-sm">
            Cancelar
          </button>
          <button 
            onClick={() => onConfirm(datos)}
            className="flex-1 py-3 bg-red-600 text-white font-semibold rounded-2xl hover:bg-red-700 shadow-lg shadow-red-200 transition-all"
          >
            Confirmar Baja
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmpleadoCeseModal;