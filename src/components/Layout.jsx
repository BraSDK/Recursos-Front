import { Link, useLocation } from 'react-router-dom';
import { Users, Briefcase, Building2, Calculator, CalendarCheck, UserPlus, Home } from 'lucide-react';

const Layout = ({ children }) => {
  const location = useLocation();

  // Función para resaltar el link activo
  const isActive = (path) => location.pathname === path ? "bg-blue-50 text-blue-600 border-r-4 border-blue-600" : "text-gray-700 hover:bg-gray-100";
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-blue-600">RRHH CK2</h2>
        </div>
        <nav className="mt-6">
          <Link to="/" className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100">
             <span className="mr-3">🏠</span> Dashboard
          </Link>
          <div className="px-6 py-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Gestión de Talento</p>
          </div>

          {/* NUEVA SECCIÓN DE RECLUTAMIENTO */}
          <Link to="/reclutamientos" className={`flex items-center px-6 py-4 transition-all ${isActive('/reclutamientos')}`}>
            <UserPlus className="w-5 h-5 mr-3" /> <span className="font-medium">Reclutamientos</span>
          </Link>
          <Link to="/empleados" className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100">
            <Users className="w-5 h-5 mr-3" /> Empleados
          </Link>
          <Link to="/puestos" className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100">
            <Briefcase className="w-5 h-5 mr-3" /> Puestos
          </Link>
          <Link to="/departamentos" className="flex items-center px-6 py-3 mt-2 text-gray-600 hover:bg-gray-100">
            <Building2 className="w-5 h-5 mr-3" /> Departamentos
          </Link>
          <Link to="#" className="flex items-center px-6 py-3 mt-2 text-gray-600 hover:bg-gray-100">
            <CalendarCheck className="w-5 h-5 mr-3" /> Asistencias
          </Link>
          <Link to="#" className="flex items-center px-6 py-3 mt-2 text-gray-600 hover:bg-gray-100">
            <Calculator className="w-5 h-5 mr-3" /> Nómina
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b">
          <h1 className="text-xl font-semibold text-gray-800">Panel de Control</h1>
          <div className="flex items-center">
            <span className="text-sm text-gray-600">admin@empresa.com</span>
          </div>
        </header>
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          {/* Aquí es donde se renderizarán las páginas (Dashboard o Empleados) */}
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;