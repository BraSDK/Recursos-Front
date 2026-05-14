import { Calendar } from 'lucide-react';

const BulkActions = ({ selectedIds, onAsignar }) => {
  if (selectedIds.length === 0) return null;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-10 duration-300">
      <div className="bg-slate-900 text-white px-6 py-4 rounded-3xl shadow-2xl flex items-center gap-6 border border-slate-700 backdrop-blur-md bg-opacity-90">
        <div className="flex items-center gap-2">
          <div className="bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-black">
            {selectedIds.length}
          </div>
          <span className="text-sm font-bold uppercase tracking-widest text-slate-300">Seleccionados</span>
        </div>
        
        <div className="h-8 w-px bg-slate-700" />

        <button 
          onClick={onAsignar}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-xs font-black uppercase transition-all active:scale-95 flex items-center gap-2"
        >
          Asignar a Grupo <Calendar size={14} />
        </button>
      </div>
    </div>
  );
};
export default BulkActions;