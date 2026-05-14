import React from 'react';
import { AlertCircle, X } from 'lucide-react';

const ModalError = ({ show, onClose, errors }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 text-center">
          <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={40} strokeWidth={2.5} />
          </div>
          
          <h3 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">Datos Incompletos</h3>
          <p className="text-slate-500 text-sm mb-6 font-medium">Por favor verifica los siguientes campos antes de finalizar:</p>

          <div className="bg-slate-50 rounded-2xl p-4 mb-8 max-h-48 overflow-y-auto border border-slate-100">
            <ul className="text-left space-y-2">
              {Object.keys(errors).map((key, index) => (
                <li key={index} className="flex items-start gap-2 text-xs font-bold text-slate-600 uppercase tracking-wide">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1 flex-shrink-0" />
                  {errors[key][0].replace('puesto id', 'puesto').replace('dni', 'DNI')}
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-200"
          >
            ENTENDIDO
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalError;