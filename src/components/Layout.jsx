import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, Briefcase, Building2, Calculator, CalendarCheck, UserPlus, UserCheck, Home } from 'lucide-react';
import Header from './layout/Header'; // Importamos tu nuevo Header
import PendientesContratacionModal from './postulacion/PendientesContratacionModal';
import EmpleadoModal from './empleados/EmpleadoModal';
import { getPendientesContratacion, getPostulantePrecontratacion } from '@/services/postulanteService';
import { getPuestos } from '@/services/puestoService';
import { createEmpleado } from '@/services/empleadoService';

const Layout = ({ children }) => {
  const location = useLocation();
  const [pendientes, setPendientes] = useState([]);
  const [puestos, setPuestos] = useState([]);
  const [showPendientes, setShowPendientes] = useState(false);
  const [showEmpleadoModal, setShowEmpleadoModal] = useState(false);
  const [postulanteSeleccionado, setPostulanteSeleccionado] = useState(null);

  // Cargar notificaciones de la campanita
  useEffect(() => {
    fetchPendientes();
    fetchPuestos();
  }, []);

  const fetchPendientes = async () => {
    try {
      const data = await getPendientesContratacion();
      setPendientes(data);
    } catch (error) {
      console.error("Error al cargar pendientes", error);
    }
  };

  const fetchPuestos = async () => {
    try {
      const data = await getPuestos();
      setPuestos(data);
    } catch (error) { console.error(error); }
  };

  const handleSelectPostulante = async (postulante) => {
    try {
      // 1. Pedimos la data formateada al backend (la que une apellidos, etc)
      const dataParaFormulario = await getPostulantePrecontratacion(postulante.id);
      
      // 2. Cargamos esa data en el estado del Layout
      setPostulanteSeleccionado(dataParaFormulario);
      
      // 3. Cerramos notificaciones y abrimos el formulario de empleado
      setShowPendientes(false);
      setShowEmpleadoModal(true);
    } catch (error) {
      console.error("Error al obtener datos de pre-alta:", error);
    }
  };

  const handleSaveDesdeCampanita = async (datos) => {
    try {
      await createEmpleado(datos);
      setShowEmpleadoModal(false);
      setPostulanteSeleccionado(null);
      fetchPendientes(); // Limpia la campanita automáticamente
      
      // Opcional: Si estás en la página de empleados, podrías necesitar 
      // refrescar esa vista. Una forma simple es recargar la página 
      // o usar un evento personalizado.
      if (location.pathname === '/empleados') {
        window.location.reload(); 
      }
    } catch (error) {
      alert("Error al crear empleado: " + (error.response?.data?.message || error.message));
    }
  };

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
          <Link to="/" className={`flex items-center px-6 py-3 transition-all ${isActive('/')}`}>
            <Home className="w-5 h-5 mr-3" /> Dashboard
          </Link>

          <Link to="/pre-seleccion" className={`flex items-center px-6 py-3 transition-all ${isActive('/pre-seleccion')}`}>
            <UserCheck className="w-5 h-5 mr-3" /> Pre-Selección
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
        {/* HEADER MODERNO CON CAMPANITA */}
        <Header 
          title="Panel de Administración" 
          pendientes={pendientes.length}
          onOpenPendientes={() => setShowPendientes(true)}
        />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          {children}
        </main>
      </div>

      {/* MODALES GLOBALES (Viven en el layout para estar siempre disponibles) */}
      <PendientesContratacionModal 
        show={showPendientes}
        pendientes={pendientes}
        onClose={() => setShowPendientes(false)}
        onSelect={handleSelectPostulante}
      />

      <EmpleadoModal 
        show={showEmpleadoModal}
        onClose={() => {
            setShowEmpleadoModal(false);
            setPostulanteSeleccionado(null);
        }}
        postulantePreload={postulanteSeleccionado} // Pasamos los datos del postulante para autocompletar
        puestos={puestos} // Pasamos la data real
        onSave={handleSaveDesdeCampanita}
      />

    </div>
  );
};

export default Layout;