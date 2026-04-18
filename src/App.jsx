import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Empleados from './pages/Empleados';
import Puestos from './pages/Puestos';
import Departamentos from './pages/Departamentos';
import Reclutamientos from './pages/Reclutamientos';
import PreSelecciones from './pages/PreSeleccion';
import FormularioPostulante from './pages/FormularioPostulante';

function App() {
  return (
    <Router>
      <Routes>
        {/* 1. RUTA TOTALMENTE LIMPIA (Para el celular del postulante) */}
        <Route path="/postular/:puestoId" element={<FormularioPostulante />} />

        {/* 2. RUTAS CON SIDEBAR (Panel Administrativo) */}
        <Route
          path="/*"
          element={
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
                <Route path="/pre-seleccion" element={<PreSelecciones />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;