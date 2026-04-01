import { useState, useEffect } from "react";
import { AlertCircle, HelpCircle, AlertTriangle, Save } from "lucide-react";

const ConfirmActionModal = ({ show, onClose, onConfirm, title, message, variant = "indigo" }) => {
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    if (show) {
      setIsRendered(true);
    } else {
      const timer = setTimeout(() => setIsRendered(false), 200);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!isRendered && !show) return null;

  // Configuración de estilos según la variante
  const configs = {
    indigo: {
      bgIcon: "bg-indigo-100",
      textColor: "text-indigo-600",
      btnColor: "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200",
      icon: <HelpCircle size={28} />
    },
    amber: {
      bgIcon: "bg-amber-100",
      textColor: "text-amber-600",
      btnColor: "bg-amber-600 hover:bg-amber-700 shadow-amber-200",
      icon: <AlertCircle size={28} />
    },
    red: {
      bgIcon: "bg-red-100",
      textColor: "text-red-600",
      btnColor: "bg-red-600 hover:bg-red-700 shadow-red-200",
      icon: <AlertTriangle size={28} />
    }
  };

  const config = configs[variant] || configs.indigo;

  return (
    <div 
      className={`fixed inset-0 z-[110] flex items-center justify-center p-4 transition-opacity duration-300 ${
        show ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Backdrop con Blur */}
      <div 
        className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" 
        onClick={onClose} 
      />
      
      {/* Contenedor Animado */}
      <div 
        className={`bg-white w-full max-w-md rounded-3xl shadow-2xl z-10 
          transition-all duration-300 transform
          ${show ? "scale-100 opacity-100" : "scale-95 opacity-0"}
        `}
      >
        <div className="p-8">
          <div className="flex flex-col items-center text-center mb-6">
            <div className={`p-4 ${config.bgIcon} ${config.textColor} rounded-2xl mb-4 shadow-sm`}>
              {config.icon}
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
          </div>
          
          <p className="text-gray-600 mb-8 leading-relaxed text-center">
            {message}
          </p>

          <div className="flex gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-200 text-gray-500 font-bold rounded-xl hover:bg-gray-50 transition-all"
            >
              No, cancelar
            </button>
            <button 
              type="button"
              onClick={onConfirm}
              className={`flex-1 px-4 py-3 ${config.btnColor} text-white font-bold rounded-xl transition-all shadow-lg active:scale-95`}
            >
              Sí, confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmActionModal;