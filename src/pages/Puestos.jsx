import { useEffect, useState } from 'react';
import { getPuestos, createPuesto, updatePuesto, deletePuesto } from '../services/puestoService';
import { getDepartamentos } from '../services/departamentoService'; // Necesario para el modal
import PuestoTable from '../components/puestos/PuestoTable';
import PuestoModal from '../components/puestos/PuestoModal';
import ConfirmModal from '../components/shared/ConfirmModal';
import PuestoFilters from '../components/puestos/PuestoFilters';
import Pagination from '../components/shared/Pagination';
import { Search, Briefcase } from 'lucide-react';

const Puestos = () => {
  const [puestos, setPuestos] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedPuesto, setSelectedPuesto] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [puestoToDelete, setPuestoToDelete] = useState(null);
  const [selectedDep, setSelectedDep] = useState("");

  // ESTADOS DE PAGINACIÓN
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // Cargamos departamentos solo una vez al inicio
  useEffect(() => {
    cargarDepartamentos();
  }, []);

  // Recargamos data cada vez que cambie un filtro
  useEffect(() => {
    cargarData();
  }, [searchTerm, selectedDep, currentPage]);

  const cargarData = async () => {
    try {
      // Enviamos los filtros directamente a la API
      const response = await getPuestos({ 
        search: searchTerm, 
        departamento_id: selectedDep,
        page: currentPage
      });

      // Ajustamos según la respuesta de Laravel Paginate
      setPuestos(response.data);
      setTotalPages(response.last_page);
      setTotalRecords(response.total);
    } catch (error) { console.error("Error cargando puestos:", error); }
  };

  const cargarDepartamentos = async () => {
    try {
      // Necesitarás este servicio para que el modal de puesto permita elegir departamento
         const data = await getDepartamentos();
         setDepartamentos(data);
    } catch (error) { console.error(error); }
  };

  const handleSave = async (datos) => {
    try {
      if (selectedPuesto) {
        await updatePuesto(selectedPuesto.id, datos);
      } else {
        await createPuesto(datos);
      }
      setShowModal(false);
      cargarData();
    } catch (error) {
      alert("Error al guardar: " + (error.response?.data?.message || error.message));
    }
  };

  const handleOpenDelete = (id, nombre) => {
    setPuestoToDelete({ id, nombre });
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    await deletePuesto(puestoToDelete.id);
    setShowDeleteModal(false);
    cargarData();
  };

  const filtered = puestos.filter(p => 
    p.nombre_puesto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Resetear página al buscar o filtrar
  const handleSearchChange = (val) => {
    setSearchTerm(val);
    setCurrentPage(1);
  };

  const handleDepChange = (val) => {
    setSelectedDep(val);
    setCurrentPage(1);
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
        currentPage={currentPage}
        totalPages={totalPages}
        totalRecords={totalRecords}
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