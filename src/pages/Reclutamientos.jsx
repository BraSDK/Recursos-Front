import { useEffect, useState } from 'react';
import { usePostulantes } from '../hooks/usePostulantes';
import { useFiltros } from '../hooks/useFiltros';
import { updatePostulante, updateFotoPostulante } from '../services/postulanteService';

import DetallePostulanteModal from '../components/postulacion/DetallePostulanteModal';
import ReclutamientoTable from '../components/reclutamientos/ReclutamientoTable';
import AsignarGrupoModal from '../components/reclutamientos/AsignarGrupoModal';
import CapacitacionDrawer from '@/components/reclutamientos/CapacitacionDrawer';
import EditarPostulanteModal from '../components/postulacion/EditarPostulanteModal';
import MenuAsistencia from '../components/reclutamientos/MenuAsistencia';
import Pagination from '@/components/shared/Pagination';
import BulkActions from '@/components/reclutamientos/BulkActions';

import { Search, UserPlus, CalendarRange, ChevronLeft, ChevronRight } from 'lucide-react';

const Reclutamientos = () => {
  const {
    postulantes,
    loading,
    meta,
    currentPage,
    setCurrentPage,
    selectedIds,
    setSelectedIds,
    searchTerm,
    setSearchTerm, // Asegúrate de que tu hook lo exporte
    cargarData
  } = usePostulantes(); 
  
  const {
    filtered,
    view,
    setView,
    filtroGrupo,
    setFiltroGrupo,
    areaActiva,
    setAreaActiva
  } = useFiltros(postulantes, searchTerm); 

  const [showAsignarModal, setShowAsignarModal] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);

  // ESTADOS PARA EL MODAL DE DETALLE
  const [showDetalle, setShowDetalle] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedPostulante, setSelectedPostulante] = useState(null);
  // En Reclutamientos.jsx, añade este estado:
  const [menuAsistencia, setMenuAsistencia] = useState({ show: false, post: null, dia: null, x: 0, y: 0 });
 // "todos", "ventas", "operaciones", "administracion"

  // FUNCIÓN PARA MANEJAR EL TOGGLE
  const handleToggleSelect = (ids) => {
    setSelectedIds(prev => {
      // Si recibimos un array vacío (ej. desmarcar todo), devolvemos []
      if (ids.length === 0 && prev.length > 0) return [];
      
      // Creamos una copia del estado actual
      const nextSelection = [...prev];
      
      ids.forEach(id => {
        if (nextSelection.includes(id)) {
          // Si ya existe, lo quitamos
          nextSelection.splice(nextSelection.indexOf(id), 1);
        } else {
          // Si no existe, lo agregamos
          nextSelection.push(id);
        }
      });
      return nextSelection;
    });
  };

  const handleOpenMenu = (e, post, numDia) => {

    // Si el día es mayor a 1, verificamos que el día anterior esté aprobado
    if (numDia > 1) {
      const etapaAnterior = `${numDia - 1}° Día de Capa`;
      const asistioAnterior = post.procesos_seleccion?.some(
        p => p.etapa === etapaAnterior && p.resultado === 'aprobado'
      );

      if (!asistioAnterior) {
        alert(`⚠️ Debe cumplir con el proceso: El Día ${numDia - 1} debe estar marcado como asistido primero.`);
        return;
      }
    }

    setMenuAsistencia({
      show: true,
      post: post,
      dia: numDia,
      x: e.clientX,
      y: e.clientY
    });
  };

  // Nueva función para guardar los cambios del modal de edición
  const handleUpdatePostulante = async (datosEditados) => {
    try {
      setLoading(true);
      // Aquí llamarías a tu servicio de actualización, ej:
      await updatePostulante(datosEditados.id, datosEditados);
      await cargarData();
      setShowEdit(false);
    } catch (error) {
      alert("Error al actualizar los datos");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateFoto = async (id, file) => {
    try {
        await updateFotoPostulante(id, file);
        await cargarData(); // Refrescamos para que la foto aparezca en la tabla y modales
    } catch (error) {
        console.error(error);
        alert("Error al subir la imagen");
    }
};

  return (
    <div className="p-6">
      {/* Header Principal */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Pipeline de Reclutamiento</h2>
          <p className="text-sm text-gray-500">Gestión de grupos semanales y capacitación de nuevos talentos.</p>
        </div>
        <div className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg font-semibold text-sm">
          <UserPlus size={18} /> {filtered.length} Postulantes
        </div>
      </div>

      {/* Sección de Navegación y Filtros */}
      <div className="space-y-4 mb-6">
        
        {/* TABS PRINCIPALES */}
        <div className="flex gap-4 border-b border-gray-200">
          <button 
            onClick={() => setView("active")}
            className={`pb-2 px-4 text-sm font-bold transition-all ${view === "active" ? "border-b-2 border-indigo-600 text-indigo-600" : "text-gray-400"}`}
          >
            Pipeline Activo
          </button>
          <button 
            onClick={() => setView("history")}
            className={`pb-2 px-4 text-sm font-bold transition-all ${view === "history" ? "border-b-2 border-indigo-600 text-indigo-600" : "text-gray-400"}`}
          >
            Historial / Finalizados
          </button>
        </div>

        {/* MINI TABLERO DE ÁREAS */}
        <div className="flex items-center gap-2 bg-white p-1 rounded-xl shadow-sm border border-gray-100 w-fit">
          {['todos', 'ventas', 'operaciones', 'administracion'].map((area) => (
            <button 
              key={area}
              onClick={() => setAreaActiva(area)}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                areaActiva === area 
                ? "bg-indigo-600 text-white shadow-md" 
                : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
              }`}
            >
              {area}
            </button>
          ))}
        </div>
      </div>

      {/* BUSCADOR Y PLANIFICACIÓN */}
      <div className="mb-6 flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Buscar por nombre o DNI..." 
            className="pl-10 w-full border border-gray-300 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={() => setShowDrawer(true)}
          className="bg-white border border-gray-300 px-4 py-2.5 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2 shadow-sm"
        >
          <CalendarRange size={18} /> Planificación
        </button>
      </div>

      {/* Tabla Componentizada */}
      <ReclutamientoTable 
        postulantes={filtered}
        selectedIds={selectedIds}          
        onToggleSelect={handleToggleSelect}
        onAsistencia={handleOpenMenu}
        onOpenDetalle={(post) => { setSelectedPostulante(post); setShowDetalle(true); }}
        onOpenEdit={(post) => { setSelectedPostulante(post); setShowEdit(true); }}
        loading={loading}
      />

      <Pagination
        meta={meta}
        currentPage={currentPage}
        onPageChange={(page) => setCurrentPage(page)}
        currentRecordsCount={filtered.length}
      />

      <BulkActions
        selectedIds={selectedIds}
        onAsignar={() => setShowAsignarModal(true)}
      />
      {/* Modal de Detalle */}
      <DetallePostulanteModal 
        show={showDetalle} 
        onClose={() => setShowDetalle(false)} 
        postulante={selectedPostulante}
        onUpdateFoto={handleUpdateFoto}
      />

      {/* Modal de Edición */}
      <EditarPostulanteModal 
        show={showEdit} 
        onClose={() => setShowEdit(false)} 
        postulante={selectedPostulante}
        onUpdate={handleUpdatePostulante}
        onUpdateFoto={handleUpdateFoto}
      />

      {/* Modal de Asignación a Grupos */}
      <AsignarGrupoModal 
        show={showAsignarModal}
        postulanteIds={selectedIds}
        onClose={() => setShowAsignarModal(false)}
        onSuccess={() => {
          setSelectedIds([]); // Limpiar selección
          cargarData();      // Refrescar tabla
        }}
      />

      <CapacitacionDrawer 
        show={showDrawer}
        onClose={() => setShowDrawer(false)}
        onSelectGrupo={(grupoId) => {
          setFiltroGrupo(grupoId);
          setShowDrawer(false);
        }}
        onClear={() => setFiltroGrupo(null)}
      />

      {/* Menú Flotante de Asistencia */}
      <MenuAsistencia 
        data={menuAsistencia} 
        onClose={() => setMenuAsistencia({ ...menuAsistencia, show: false })} 
        onAction={cargarData} // Para recargar la tabla después de marcar asistencia/falta
      />
    </div>
  );
};

export default Reclutamientos;