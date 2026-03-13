import { useEffect, useState } from 'react';
import { getEmpleados, deleteEmpleado } from '../services/empleadoService';
import EmpleadoModal from '../components/empleados/EmpleadoModal';
import EmpleadoTable from '../components/empleados/EmpleadoTable'; // Nuevo
import { Search, UserPlus } from 'lucide-react';

const Empleados = () => {
  const [empleados, setEmpleados] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedEmpleado, setSelectedEmpleado] = useState(null);

  useEffect(() => { cargarData(); }, []);

  const cargarData = async () => {
    try {
      const data = await getEmpleados();
      setEmpleados(data);
    } catch (error) { console.error(error); }
  };

  // HANDLERS
  const handleOpenEdit = (emp) => {
    setSelectedEmpleado(emp);
    setShowModal(true);
  };

  const handleDelete = async (id, nombre) => {
    if (window.confirm(`¿Eliminar a ${nombre}?`)) {
      await deleteEmpleado(id);
      cargarData(); // Refrescar
    }
  };

  // Filtrado
  const filtered = empleados.filter(emp => 
    `${emp.nombres} ${emp.apellidos}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.dni.includes(searchTerm)
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gestión de Empleados</h2>
        <button 
          onClick={() => { setSelectedEmpleado(null); setShowModal(true); }} 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <UserPlus className="mr-2 w-4 h-4"/> Nuevo Empleado
        </button>
      </div>

      {/* Buscador */}
      <div className="mb-4 relative">
        <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
        <input 
          type="text" 
          placeholder="Buscar..." 
          className="pl-10 w-full border rounded-lg p-2"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* LA TABLA COMPONENTIZADA */}
      <EmpleadoTable 
        empleados={filtered} 
        onEdit={handleOpenEdit} 
        onDelete={handleDelete} 
      />

      <EmpleadoModal 
        show={showModal} 
        onClose={() => setShowModal(false)} 
        empleado={selectedEmpleado}
        puestos={[]} // Luego traeremos esto de la API
      />
    </div>
  );
};

export default Empleados;