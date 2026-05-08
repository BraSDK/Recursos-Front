import { useEffect, useState } from 'react';
import { usePuestos } from '../hooks/usePuestos';
import { getPuestos, createPuesto, updatePuesto, deletePuesto } from '../services/puestoService';
import { getDepartamentos } from '../services/departamentoService'; // Necesario para el modal
import PuestoTable from '../components/puestos/PuestoTable';
import PuestoModal from '../components/puestos/PuestoModal';
import ConfirmModal from '../components/shared/ConfirmModal';
import PuestoFilters from '../components/puestos/PuestoFilters';
import Pagination from '../components/shared/Pagination';
import { Search, Briefcase } from 'lucide-react';

const Puestos = () => {

  const {
    puestos,
    meta,
    currentPage,
    setCurrentPage,
    searchTerm,
    setSearchTerm,
    selectedDep,
    setSelectedDep,
    guardarPuesto,
    eliminarPuesto,
    loading
  } = usePuestos();

  const [departamentos, setDepartamentos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPuesto, setSelectedPuesto] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [puestoToDelete, setPuestoToDelete] = useState(null);

  // Cargamos departamentos solo una vez al inicio
  useEffect(() => {
    cargarDepartamentos();
  }, []);

  const cargarDepartamentos = async () => {
    try {
      const response = await getDepartamentos();
      // Verificamos si viene paginado o es array simple
      const lista = response.data && Array.isArray(response.data) 
        ? response.data 
        : response;
      setDepartamentos(lista);
    } catch (error) { 
      console.error("Error al cargar departamentos:", error);
      setDepartamentos([]);
      }
  };

  const confirmDelete = async () => {
    await deletePuesto(puestoToDelete.id);
    setShowDeleteModal(false);
    cargarData();
  };

  // Resetear página al buscar o filtrar
  const handleSearchChange = (val) => {
    setSearchTerm(val); 
    setCurrentPage(1);
  };

  const handleDepChange = (val) => {
    setSelectedDep(val);
    setCurrentPage(1);
  };

  const handleSave = async (datos) => {
    try {
      await guardarPuesto(datos, selectedPuesto?.id);
      setShowModal(false);
    } catch (error) {
      alert("Error: " + (error.response?.data?.message || error.message));
    }
  };

  const handleOpenDelete = (id, nombre) => {
    setPuestoToDelete({ id, nombre });
    setShowDeleteModal(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gestión de Puestos</h2>
        <button 
          onClick={() => { setSelectedPuesto(null); setShowModal(true); }} 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors"
        >
          <Briefcase className="mr-2 w-4 h-4"/> Nuevo Puesto
        </button>
      </div>

      <PuestoFilters 
        searchTerm={searchTerm} 
        setSearchTerm={handleSearchChange}
        selectedDep={selectedDep}
        setSelectedDep={handleDepChange}
        departamentos={departamentos}
      />

      <PuestoTable 
        puestos={puestos} 
        onEdit={(p) => { setSelectedPuesto(p); setShowModal(true); }} 
        onDelete={handleOpenDelete} 
      />

      <Pagination 
        meta={meta}
        currentPage={currentPage}
        currentRecordsCount={puestos.length}
        onPageChange={(page) => setCurrentPage(page)}
      />

      <PuestoModal 
        show={showModal} 
        onClose={() => setShowModal(false)} 
        onSave={handleSave}
        puesto={selectedPuesto}
        departamentos={departamentos}
      />

      <ConfirmModal 
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="¿Eliminar puesto?"
        message={`¿Estás seguro de eliminar el cargo de ${puestoToDelete?.nombre}?`}
      />
    </div>
  );
};

export default Puestos;