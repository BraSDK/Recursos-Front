import { Link } from 'react-router-dom';
import { Users, Building2, Calculator, CalendarCheck } from 'lucide-react';

const Layout = ({ children }) => {
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
          <Link to="/empleados" className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100">
            <Users className="w-5 h-5 mr-3" /> Empleados
          </Link>
          <Link to="#" className="flex items-center px-6 py-3 mt-2 text-gray-600 hover:bg-gray-100">
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

// ¡ESTA LÍNEA ES LA QUE FALTA Y POR ESO SALE EN BLANCO!
export default Layout;