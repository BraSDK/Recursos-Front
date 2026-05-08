import { actualizarAsistencia, anularAsistencia } from '@/services/postulanteService';

const MenuAsistencia = ({ data, onClose, onAction }) => {
    if (!data.show) return null;

    const handleAsistencia = async (estado) => {
      await actualizarAsistencia(data.post.id, data.dia, estado);
      onClose();
      onAction(); // recarga
    };
    
    const handleAnular = async () => {
      await anularAsistencia(data.post.id, data.dia);
      onClose();
      onAction();
    };

    return (
      <>
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose}/>
            <div 
              className="fixed z-[70] bg-white border border-gray-200 shadow-2xl rounded-2xl w-52 py-2 animate-in fade-in zoom-in duration-200"
              style={{ top: data.y, left: data.x - 200 }} // Ajuste para que no se salga de la pantalla
            >
            <div className="px-4 py-2 border-b border-gray-50 mb-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Opciones Día {data.dia}
                </p>
            </div>

            <button 
              onClick={() => handleAsistencia(true)}
              className="w-full px-4 py-2.5 text-left text-sm font-semibold text-green-600 hover:bg-green-50 flex items-center gap-3 transition-colors"
            >
                <div className="w-2 h-2 rounded-full bg-green-500" /> 
                Marcar Asistencia
            </button>

            <button 
                onClick={async () => {
                if(window.confirm("¿Confirmar falta? Pasará a NO APTO.")) {
                    handleAsistencia(false);
                    }
                }}
                className="w-full px-4 py-2.5 text-left text-sm font-semibold text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
            >
                <div className="w-2 h-2 rounded-full bg-red-500" /> 
                Marcar Falta
            </button>

            <div className="h-px bg-gray-100 my-1" />

            <button 
                onClick={handleAnular}
                className="w-full px-4 py-2.5 text-left text-sm font-medium text-gray-500 hover:bg-gray-100 flex items-center gap-3 transition-colors"
            >
                <div className="w-2 h-2 rounded-full bg-gray-300" /> 
                Anular Registro
            </button>
        </div>
      </>
    );
};  
export default MenuAsistencia;