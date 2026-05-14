import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, Briefcase, Building2, Calculator, CalendarCheck, CalendarRange, UserPlus, UserCheck, Home } from 'lucide-react';
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
      const response = await getPuestos();
      // Verificamos si la data viene en response, response.data o response.data.data
      const listaPuestos = Array.isArray(response) 
        ? response 
        : (response.data && Array.isArray(response.data) ? response.data : []);
        
      setPuestos(listaPuestos);
    } catch (error) { 
      console.error("Error al cargar puestos:", error);
      setPuestos([]); // Fallback a array vacío para evitar que .map explote
    }
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
  const isActive = (path) => location.pathname === path ? "bg-red-50 text-red-600 border-r-4 border-red-600" : "text-gray-700 hover:bg-gray-100";
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="px-6 py-8 border-b border-slate-50 flex items-center justify-center min-h-[100px]">
          <img 
            src="Layout_ck2.png" /* Reemplaza esto con tu import o ruta */
            alt="Logo de la Empresa" 
            className="h-12 w-auto object-contain" /* h-12 (48px) suele ser perfecto para logos rectangulares */
          />
        </div>
        <nav className="mt-4 flex-1 overflow-y-auto">
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
          {/* NUEVO LINK DE CALENDARIO */}
          <Link to="/capacitaciones" className={`flex items-center px-6 py-4 transition-all ${isActive('/capacitaciones')}`}>
            <CalendarRange className="w-5 h-5 mr-3" /> <span className="font-medium">Agenda de Capacitación</span>
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