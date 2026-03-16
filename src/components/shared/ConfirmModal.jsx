import { useState, useEffect } from "react";
import { AlertTriangle } from "lucide-react";

const ConfirmModal = ({ show, onClose, onConfirm, title, message }) => {
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

  return (
    <div 
      className={`fixed inset-0 z-[60] flex items-center justify-center p-4 transition-opacity duration-300 ${
        show ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Backdrop con Blur */}
      <div 
        className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" 
        onClick={onClose} 
      />
      
      {/* Contenedor con Animación de Escala */}
      <div 
        className={`bg-white w-full max-w-md rounded-2xl shadow-2xl z-10 
          transition-all duration-300 transform
          ${show ? "scale-100 opacity-100" : "scale-95 opacity-0"}
        `}
      >
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-red-100 rounded-2xl text-red-600">
              <AlertTriangle size={28} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-500">Esta acción no es reversible.</p>
            </div>
          </div>
          
          <p className="text-gray-600 mb-8 leading-relaxed">
            {message}
          </p>

          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all shadow-sm"
            >
              No, cancelar
            </button>
            <button 
              onClick={onConfirm}
              className="flex-1 px-4 py-2.5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all shadow-sm shadow-red-200"
            >
              Sí, eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;