import React, { useState, useEffect } from 'react';
import { Bell, LogOut } from 'lucide-react'; // <-- Agregamos el ícono LogOut
import { logoutUsuario } from '@/services/authService'; // <-- Importamos tu función de cerrar sesión

const Header = ({ title, pendientes = 0, onOpenPendientes }) => {
  const [user, setUser] = useState(null);

  // Buena Práctica: Usar useEffect para leer el localStorage al cargar el componente
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error al leer los datos del usuario");
      }
    }
  }, []);

  // Obtenemos la inicial del nombre, si no hay usuario cargado ponemos una 'U' por defecto
  const inicial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-slate-100 shadow-sm">
      <h1 className="text-xl font-bold text-slate-800">{title}</h1>
      
      <div className="flex items-center gap-6">
        {/* Campanita de Notificaciones */}
        <button 
          onClick={onOpenPendientes}
          className="relative p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-all"
        >
          <Bell size={22} />
          {pendientes > 0 && (
            <span className="absolute top-1.5 right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
              {pendientes}
            </span>
          )}
        </button>

        {/* Zona de Perfil de Usuario */}
        <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
          <div className="text-right hidden sm:block"> {/* Se oculta en móviles para no romper el diseño */}
            <p className="text-sm font-bold text-slate-900">{user?.name || 'Cargando...'}</p>
            <p className="text-xs text-slate-400">{user?.email || '...'}</p>
          </div>
          
          <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white font-bold shadow-sm shadow-red-200">
            {inicial}
          </div>

          {/* Botón de Cerrar Sesión */}
          <button 
            onClick={logoutUsuario}
            title="Cerrar sesión"
            className="ml-2 p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;