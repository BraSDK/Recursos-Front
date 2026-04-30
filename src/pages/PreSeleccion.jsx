import { useEffect, useState } from 'react';
import { Search, UserPlus, Filter, Clock, CheckCircle2, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { getPuestos } from '@/services/puestoService';
import { getPreSelecciones, createPreSeleccion, updatePreSeleccion, deletePreSeleccion } from '@/services/preseleccionService';
import PreSeleccionTable from '@/components/preseleccion/PreSeleccionTable';
import PreSeleccionModal from '@/components/preseleccion/PreSeleccionModal';

const PreSelecciones = () => {
  const [invitaciones, setInvitaciones] = useState([]);
  const [puestos, setPuestos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // ESTADOS PARA PAGINACIÓN Y TABS
  const [activeTab, setActiveTab] = useState('pendiente');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [selectedPre, setSelectedPre] = useState(null);

  useEffect(() => {
    cargarData();
  }, [activeTab, currentPage, searchTerm]);

  useEffect(() => {
    cargarPuestos();
  }, []);

  const cargarData = async () => {
    try {
      const response = await getPreSelecciones({ 
        estado: activeTab, 
        page: currentPage, 
        search: searchTerm 
      });
      // Laravel paginate() devuelve la data en response.data
      setInvitaciones(response.data); 
      setTotalPages(response.last_page);
      setTotalRecords(response.total);
    } catch (error) { console.error(error); }
  };

  const cargarPuestos = async () => {
    try {
      const response = await getPuestos();
      // Si la respuesta tiene la propiedad 'data' (paginación), guardamos solo el array
      const listaPuestos = response.data && Array.isArray(response.data) 
        ? response.data 
        : response; 
        
      setPuestos(listaPuestos);
    } catch (error) { 
      console.error("Error al cargar puestos:", error);
      setPuestos([]); 
    }
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setCurrentPage(1); // Resetear a página 1 al cambiar de tab
  };

  const handleSave = async (datos) => {
    try {
      if (selectedPre) {
        await updatePreSeleccion(selectedPre.id, datos);
      } else {
        await createPreSeleccion(datos);
      }
      setShowModal(false);
      cargarData();
    } catch (error) {
      alert("Error: " + (error.response?.data?.message || error.message));
    }
  };

  const filtered = invitaciones.filter(inv => 
    inv.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.dni.includes(searchTerm)
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Pre-Selección</h2>
          <p className="text-sm text-gray-500">Registra los candidatos autorizados para postular.</p>
        </div>
        <button 
          onClick={() => { setSelectedPre(null); setShowModal(true); }} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold transition-all shadow-lg shadow-blue-100"
        >
          <UserPlus size={18}/> Invitar Candidato
        </button>
      </div>

      {/* TABS DE ESTADO */}
      <div className="flex border-b border-gray-200 gap-2">
        {[
          { id: 'pendiente', label: 'Pendientes', icon: <Clock size={18}/>, color: 'text-amber-600' },
          { id: 'completado', label: 'Completados', icon: <CheckCircle2 size={18}/>, color: 'text-green-600' },
          { id: 'expirado', label: 'Expirados', icon: <AlertCircle size={18}/>, color: 'text-red-600' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-bold transition-all border-b-2 ${
              activeTab === tab.id 
                ? `border-blue-600 ${tab.color} bg-blue-50/50` 
                : 'border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-50'
            } rounded-t-lg`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder={`Buscar en ${activeTab}...`}
            className="pl-10 w-full border-none bg-white shadow-sm rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500/20"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
        </div>
      </div>

      <PreSeleccionTable 
        invitaciones={invitaciones} 
        onEdit={(inv) => { setSelectedPre(inv); setShowModal(true); }}
        onDelete={async (id) => { if(confirm('¿Eliminar invitación?')) { await deletePreSeleccion(id); cargarData(); } }}
      />

      {/* CONTROLES DE PAGINACIÓN */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="text-sm text-gray-500">
          Mostrando <span className="font-bold text-gray-900">{invitaciones.length}</span> de <span className="font-bold text-gray-900">{totalRecords}</span> registros
        </div>
        <div className="flex items-center gap-2">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
            className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft size={20} />
          </button>
          
          <div className="flex items-center px-4 text-sm font-bold text-gray-700">
            Página {currentPage} de {totalPages}
          </div>

          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
            className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <PreSeleccionModal 
        show={showModal} 
        onClose={() => setShowModal(false)} 
        onSave={handleSave} 
        invitacion={selectedPre}
        puestos={puestos}
      />
    </div>
  );
};

export default PreSelecciones;