import { useEffect, useState } from 'react';
import { Search, UserPlus } from 'lucide-react';
import { getPuestos } from '../services/puestoService';
import { getEmpleados, deleteEmpleado, createEmpleado, cesarEmpleado, updateEmpleado } from '../services/empleadoService';
import EmpleadoModal from '../components/empleados/EmpleadoModal';
import EmpleadoTable from '../components/empleados/EmpleadoTable';
import CeseEmpleadoModal from '../components/empleados/EmpleadoCeseModal';

const Empleados = () => {
  const [empleados, setEmpleados] = useState([]);
  const [puestos, setPuestos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedEmpleado, setSelectedEmpleado] = useState(null);
  const [empleadoToDelete, setEmpleadoToDelete] = useState(null);
  const [showCeseModal, setShowCeseModal] = useState(false);

  // Cargar datos al montar el componente
  useEffect(() => {
    cargarData();
    cargarPuestos();
  }, []);

  const cargarPuestos = async () => {
    try {
      const res = await getPuestos();
      // Si res ya es el array (porque en el service hiciste return response.data)
      // asegúrate de que realmente sea un array lo que llega.
      setPuestos(Array.isArray(res) ? res : res.data || []);
    } catch (error) {
      console.error("Error al cargar puestos:", error);
      setPuestos([]); // En caso de error, dejamos un array vacío para que no rompa
    }
  };

  const handleSave = async (datos) => {
    try {
      if (selectedEmpleado) {
        // EDITAR (PUT)
        await updateEmpleado(selectedEmpleado.id, datos);
      } else {
        // CREAR (POST)
        await createEmpleado(datos);
      }
      setShowModal(false);
      cargarData();
    } catch (error) {
      // Manejo de errores de validación de Laravel
      alert("Error al guardar: " + (error.response?.data?.message || error.message));
    }
  };

  // Esta función la recibe la Tabla
  const handleOpenDelete = (id, nombre) => {
    setEmpleadoToDelete({ id, nombre }); // Guardamos quién se va
    setShowCeseModal(true);            // Abrimos el modal
  };

  const handleConfirmCese = async (datosCese) => {
    try {
      await cesarEmpleado(empleadoToDelete.id, datosCese);
      setShowCeseModal(false);
      cargarData(); // Refresca la tabla y verás al empleado como 'Inactivo'
    } catch (error) {
      alert("Error al procesar la baja");
    }
  };

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
        onDelete={handleOpenDelete} 
      />

      <EmpleadoModal 
        show={showModal} 
        onClose={() => setShowModal(false)} 
        onSave={handleSave} // Pasamos la función de guardado
        empleado={selectedEmpleado} // Si es null, el modal estará vacío (Modo Crear)
        puestos={puestos} // Pasamos la lista real de puestos de la BD
      />

      {/* El Modal vive aquí, una sola vez en toda la página */}
      <CeseEmpleadoModal 
        show={showCeseModal}
        onClose={() => setShowCeseModal(false)}
        onConfirm={handleConfirmCese}
        empleadoNombre={empleadoToDelete?.nombre || ""}
      />
    </div>
  );
};

export default Empleados;