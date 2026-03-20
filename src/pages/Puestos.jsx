import { useEffect, useState } from 'react';
import { getPuestos, createPuesto, updatePuesto, deletePuesto } from '../services/puestoService';
import { getDepartamentos } from '../services/departamentoService'; // Necesario para el modal
import PuestoTable from '../components/puestos/PuestoTable';
import PuestoModal from '../components/puestos/PuestoModal';
import ConfirmModal from '../components/shared/ConfirmModal';
import { Search, Briefcase } from 'lucide-react';

const Puestos = () => {
  const [puestos, setPuestos] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedPuesto, setSelectedPuesto] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [puestoToDelete, setPuestoToDelete] = useState(null);

  useEffect(() => {
    cargarData();
    cargarDepartamentos();
  }, []);

  const cargarData = async () => {
    try {
      const data = await getPuestos();
      setPuestos(data);
    } catch (error) { console.error(error); }
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

      <div className="mb-4 relative">
        <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
        <input 
          type="text" 
          placeholder="Buscar puesto..." 
          className="pl-10 w-full border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-500/20"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <PuestoTable 
        puestos={filtered} 
        onEdit={(p) => { setSelectedPuesto(p); setShowModal(true); }} 
        onDelete={handleOpenDelete} 
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