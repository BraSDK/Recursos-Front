import { useEffect, useState } from "react";
import { X, UserCheck, Briefcase, ChevronRight, AlertCircle } from "lucide-react";

const PendientesContratacionModal = ({ show, pendientes = [], onSelect, onClose }) => {
    const [isAnimate, setIsAnimate] = useState(false);
  
    // Sincronizar la animación interna con la prop 'show'
    useEffect(() => {
      if (show) {
        setTimeout(() => setIsAnimate(true), 10); // Pequeño delay para activar transición
      } else {
        setIsAnimate(false);
      }
    }, [show]);
  
    const handleClose = () => {
      setIsAnimate(false);
      setTimeout(onClose, 300); // Esperamos a que termine la animación de 300ms antes de desmontar
    };
  
    if (!show && !isAnimate) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end overflow-hidden">
      {/* Backdrop con desvanecimiento controlado por isAnimate */}
      <div 
        className={`absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${
          isAnimate ? "opacity-100" : "opacity-0"
        }`} 
        onClick={handleClose} 
      />
      
      {/* Panel Lateral Animado con Transform (Desliza desde/hacia la derecha) */}
      <div className={`relative bg-white w-full max-w-sm h-full shadow-2xl flex flex-col transition-transform duration-300 ease-in-out transform ${
        isAnimate ? "translate-x-0" : "translate-x-full"
      }`}>
        
        {/* Header del Panel */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 text-green-600 rounded-lg">
              <UserCheck size={20} />
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-900">Pendientes de Alta</h4>
              <p className="text-xs text-gray-500 font-medium">Postulantes Aptos para Empleado</p>
            </div>
          </div>
          <button 
            onClick={handleClose} 
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400"
          >
            <X size={20} />
          </button>
        </div>

        {/* Lista de Pendientes */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {pendientes.length > 0 ? (
            pendientes.map((postulante) => (
              <button
                key={postulante.id}
                onClick={() => onSelect(postulante)}
                className="w-full flex items-center justify-between p-4 border border-gray-100 rounded-2xl bg-white hover:border-blue-200 hover:shadow-md hover:shadow-blue-50 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    {postulante.nombres.charAt(0)}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-gray-900 leading-none mb-1">
                      {postulante.nombres} {postulante.apellido_paterno}
                    </p>
                    <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                      <Briefcase size={10} />
                      {postulante.puesto?.nombre_puesto || 'Puesto no definido'}
                    </div>
                  </div>
                </div>
                <ChevronRight size={18} className="text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
              </button>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center p-6">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 mb-4">
                <AlertCircle size={32} />
              </div>
              <p className="text-sm font-bold text-gray-800">No hay altas pendientes</p>
              <p className="text-xs text-gray-400 mt-1">Todos los postulantes aptos ya fueron procesados.</p>
            </div>
          )}
        </div>

        {/* Footer Informativo */}
        <div className="p-6 border-t border-gray-50 bg-gray-50/50">
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">💡 Tip de Gestión</p>
            <p className="text-[11px] text-gray-600 leading-relaxed">
              Haz clic en un postulante para pre-cargar sus datos en la ficha de empleado y finalizar su contratación.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendientesContratacionModal;