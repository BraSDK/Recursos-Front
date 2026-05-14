import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Empleados from './pages/Empleados';
import Puestos from './pages/Puestos';
import Departamentos from './pages/Departamentos';
import Reclutamientos from './pages/Reclutamientos';
import PreSelecciones from './pages/PreSeleccion';
import Capacitaciones from './pages/Capacitaciones';
import FormularioPostulante from './pages/FormularioPostulante';

// 1. IMPORTAMOS LAS NUEVAS PIEZAS
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute'; // Ajusta la ruta si lo pusiste en otra carpeta

function App() {
  return (
    <Router>
      <Routes>
        {/* ==========================================
            RUTAS PÚBLICAS (No requieren sesión)
            ========================================== */}
        
        {/* Nueva ruta de Login */}
        <Route path="/login" element={<Login />} />
        
        {/* Formulario del candidato (Celular) */}
        <Route path="/postular/:puestoId" element={<FormularioPostulante />} />

        {/* ==========================================
            RUTAS PROTEGIDAS (Panel Administrativo)
            ========================================== */}
        <Route
          path="/*"
          element={
            /* 2. ENVOLVEMOS EL LAYOUT CON EL GUARDIÁN */
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={
                    <div className="bg-white p-6 rounded-lg shadow">
                      <h2 className="text-2xl font-bold">Dashboard de RRHH</h2>
                      <p className="text-gray-600">Bienvenido al sistema de gestión.</p>
                    </div>
                  } />
                  <Route path="/empleados" element={<Empleados />} />
                  <Route path="/puestos" element={<Puestos />} />
                  <Route path="/departamentos" element={<Departamentos />} />
                  <Route path="/reclutamientos" element={<Reclutamientos />} />
                  <Route path="/capacitaciones" element={<Capacitaciones />} />
                  <Route path="/pre-seleccion" element={<PreSelecciones />} />
                  
                  {/* Opcional: Si escriben una ruta que no existe dentro del panel, los mandamos al inicio */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;