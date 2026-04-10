import { Bell, User } from 'lucide-react';

const Header = ({ title, pendientes = 0, onOpenPendientes }) => {
  return (
    <header className="flex items-center justify-between px-8 py-4 bg-white border-b shadow-sm">
      <h1 className="text-xl font-bold text-gray-800">{title}</h1>
      
      <div className="flex items-center gap-6">
        {/* Campanita de Notificaciones */}
        <button 
          onClick={onOpenPendientes}
          className="relative p-2 text-gray-400 hover:bg-gray-50 rounded-xl transition-all"
        >
          <Bell size={22} />
          {pendientes > 0 && (
            <span className="absolute top-1.5 right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
              {pendientes}
            </span>
          )}
        </button>

        <div className="flex items-center gap-3 pl-6 border-l">
          <div className="text-right">
            <p className="text-sm font-bold text-gray-900">Admin CK2</p>
            <p className="text-xs text-gray-400">admin@empresa.com</p>
          </div>
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold">
            A
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;