import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Empleados from './pages/Empleados';
import Puestos from './pages/Puestos';
import Departamentos from './pages/Departamentos';

function App() {
  return (
    <Router>
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
          <Route path="/Departamentos" element={<Departamentos />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;