import { useEffect, useState } from 'react';
import { getDepartamentos, createDepartamento, updateDepartamento, deleteDepartamento } from '../services/departamentoService';
import ConfirmModal from '../components/shared/ConfirmModal';
import DepartamentoModal from '../components/departamentos/DepartamentoModal';
import DepartamentoTable from '../components/departamentos/DepartamentoTable';
import { Search, Building2, Plus } from 'lucide-react';

const Departamentos = () => {
  const [departamentos, setDepartamentos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  // ESTADOS PARA MODALES
  const [showModal, setShowModal] = useState(false);
  const [selectedDep, setSelectedDep] = useState(null); // null = crear, con datos = editar
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [depToDelete, setDepToDelete] = useState(null);

  useEffect(() => {
    cargarData();
  }, []);

  const cargarData = async () => {
    try {
      const data = await getDepartamentos();
      setDepartamentos(data);
    } catch (error) {
      console.error("Error al cargar departamentos:", error);
    }
  };

  const handleSave = async (datos) => {
    try {
      if (selectedDep) {
        // Actualizar (PUT) - datos ya viene mapeado desde el modal
        await updateDepartamento(selectedDep.id, datos);
      } else {
        // Crear (POST)
        await createDepartamento(datos);
      }
      setShowModal(false);
      cargarData(); // Refrescar tabla
    } catch (error) {
      const msg = error.response?.data?.message || "Error al procesar la solicitud";
      alert("Error: " + msg);
    }
  };

  const handleOpenDelete = (id, nombre) => {
    setDepToDelete({ id, nombre });
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteDepartamento(depToDelete.id);
      setShowDeleteModal(false);
      cargarData();
    } catch (error) {
      alert("No se pudo eliminar el departamento. Verifique si tiene puestos asociados.");
    }
  };

  // Lógica de filtrado por nombre o código
  const filtered = departamentos.filter(dep => 
    dep.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dep.codigo_dep?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Departamentos</h2>
          <p className="text-sm text-gray-500">Administra las áreas y unidades de la organización.</p>
        </div>
        <button 
          onClick={() => { setSelectedDep(null); setShowModal(true); }} 
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center transition-all shadow-sm shadow-indigo-100"
        >
          <Plus className="mr-2 w-4 h-4"/> Nuevo Departamento
        </button>
      </div>

      {/* Buscador */}
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
        <input 
          type="text" 
          placeholder="Buscar por nombre o código (ej: RRHH)..." 
          className="pl-10 w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Tabla Componentizada */}
      <DepartamentoTable 
        departamentos={filtered} 
        onEdit={(dep) => { setSelectedDep(dep); setShowModal(true); }} 
        onDelete={handleOpenDelete} 
      />

      {/* Modal de Registro/Edición */}
      <DepartamentoModal 
        show={showModal} 
        onClose={() => setShowModal(false)} 
        onSave={handleSave}
        departamento={selectedDep}
      />

      {/* Modal de Confirmación Reutilizable */}
      <ConfirmModal 
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="¿Eliminar departamento?"
        message={`¿Estás seguro de que deseas eliminar el área de ${depToDelete?.nombre}? Esta acción no se puede deshacer.`}
      />
    </div>
  );
};

export default Departamentos;