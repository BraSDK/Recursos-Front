import { useEffect, useState } from 'react';
import { getPostulantes, actualizarAsistencia, anularAsistencia, updatePostulante, updateFotoPostulante } from '../services/postulanteService';
import DetallePostulanteModal from '../components/postulacion/DetallePostulanteModal';
import ReclutamientoTable from '../components/reclutamientos/ReclutamientoTable';
import AsignarGrupoModal from '../components/reclutamientos/AsignarGrupoModal';
import DrawerPlanificacion from '../components/reclutamientos/DrawerPlanificacion';
import EditarPostulanteModal from '../components/postulacion/EditarPostulanteModal';
import { Search, UserPlus, CalendarRange, ChevronLeft, ChevronRight } from 'lucide-react';

const Reclutamientos = () => {
  const [postulantes, setPostulantes] = useState([]);
  const [meta, setMeta] = useState({ 
    current_page: 1, 
    last_page: 1, 
    total: 0 
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAsignarModal, setShowAsignarModal] = useState(false);

  // ESTADOS PARA EL MODAL DE DETALLE
  const [showDetalle, setShowDetalle] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedPostulante, setSelectedPostulante] = useState(null);
  // En Reclutamientos.jsx, añade este estado:
  const [menuAsistencia, setMenuAsistencia] = useState({ show: false, post: null, dia: null, x: 0, y: 0 });

  // Creamos un estado para alternar entre "Activos" e "Historial"
  const [view, setView] = useState("active"); // "active" o "history"

  // Asignar Grupos por Horario
  const [showDrawer, setShowDrawer] = useState(false);
  const [filtroGrupo, setFiltroGrupo] = useState(null);
  const [areaActiva, setAreaActiva] = useState("todos"); // "todos", "ventas", "operaciones", "administracion"

  useEffect(() => {
    cargarData(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

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

  const cargarData = async (page = 1, search = "") => {
    try {
      setLoading(true);
      const response = await getPostulantes(page, search);
      setPostulantes(response.data);
      setMeta({
        current_page: response.current_page,
        last_page: response.last_page,
        total: response.total
      });
    } catch (error) {
      console.error("Error al cargar postulantes:", error);
    } finally {
      setLoading(false);
    }
  };

  const normalize = (text) =>
    text?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // Filtrado optimizado: Busca por DNI o Nombre Completo
  const filtered = postulantes.filter(post => {
    const term = normalize(searchTerm);
    const nombreCompleto = normalize(`${post.nombres} ${post.apellido_paterno} ${post.apellido_materno}`);

    // 1. Filtro por Búsqueda (Texto/DNI)
    const matchesSearch = nombreCompleto.includes(term) || 
                          post.dni?.toString().includes(term) || 
                          normalize(post.horario_interes).includes(term);

    // 2. Filtro Vista (Activo/Historial)
    const isHistory = post.estado_proceso === 'gestion' || post.estado_proceso === 'no_apto';
    const matchesView = view === "active" ? !isHistory : isHistory;

    // 3. Filtro por Grupo (si se ha seleccionado uno)
    let matchesGrupo = true; // Si filtroGrupo es null, muestra todo.
    if (filtroGrupo === 'sin_asignar') { // Si es 'sin_asignar', muestra donde grupo_id sea null.
      matchesGrupo = !post.grupo_id;  // Si es un ID, filtra por ese grupo.
    } else if (filtroGrupo !== null) {
      matchesGrupo = post.grupo_id === filtroGrupo;
    }

    // 4. Filtro por Área de Interés
    const matchesArea = areaActiva === "todos" ? true : post.area_general === areaActiva;

    // AMBOS deben ser verdaderos
    return matchesSearch && matchesView && matchesGrupo && matchesArea;
  });

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

      {/* CONTROLES DE PAGINACIÓN */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm mt-6">
        <div className="text-sm text-gray-500">
          Mostrando <span className="font-bold text-gray-900">{postulantes.length}</span> de <span className="font-bold text-gray-900">{meta.total}</span> registros
        </div>
        <div className="flex items-center gap-2">
          <button 
            disabled={meta.current_page === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
            className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-30 transition-all"
          >
            <ChevronLeft size={20} />
          </button>
          
          <div className="flex items-center px-4 text-sm font-bold text-gray-700">
            Página {meta.current_page} de {meta.last_page}
          </div>

          <button 
            disabled={meta.current_page === meta.last_page}
            onClick={() => setCurrentPage(prev => prev + 1)}
            className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-30 transition-all"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {selectedIds.length > 0 && (
        <div className="fixed bottom-8 right-8 bg-gray-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 z-50 animate-in slide-in-from-bottom-10">
          <span className="font-bold text-sm">{selectedIds.length} seleccionados</span>
          <button 
            onClick={() => setShowAsignarModal(true)}
            className="bg-indigo-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all flex items-center gap-2"
          >
            <UserPlus size={16} /> Asignar a Capacitación
          </button>
        </div>
      )}

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

      <DrawerPlanificacion 
        show={showDrawer}
        onClose={() => setShowDrawer(false)}
        onSelectGrupo={(grupoId) => {
          setFiltroGrupo(grupoId); // Esto actualiza el filtro y la tabla se filtra sola
          setShowDrawer(false);    // Cerramos el drawer tras elegir
        }}
        onClearFilters={() => setFiltroGrupo(null)} // Para limpiar el filtro
      />

      {/* Menú Flotante de Asistencia */}
      {menuAsistencia.show && (
        <>
          <div className="fixed inset-0 z-[60]" onClick={() => setMenuAsistencia({ ...menuAsistencia, show: false })} />
          <div 
            className="fixed z-[70] bg-white border border-gray-200 shadow-2xl rounded-2xl w-52 py-2 animate-in fade-in zoom-in duration-200"
            style={{ top: menuAsistencia.y, left: menuAsistencia.x - 200 }} // Ajuste para que no se salga de la pantalla
          >
            <div className="px-4 py-2 border-b border-gray-50 mb-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Opciones Día {menuAsistencia.dia}</p>
            </div>

            <button 
              onClick={async () => {
                setMenuAsistencia({ ...menuAsistencia, show: false });
                await actualizarAsistencia(menuAsistencia.post.id, menuAsistencia.dia, true);
                cargarData();
              }}
              className="w-full px-4 py-2.5 text-left text-sm font-semibold text-green-600 hover:bg-green-50 flex items-center gap-3 transition-colors"
            >
              <div className="w-2 h-2 rounded-full bg-green-500" /> Marcar Asistencia
            </button>

            <button 
              onClick={async () => {
                if(window.confirm("¿Confirmar falta? Pasará a NO APTO.")) {
                  setMenuAsistencia({ ...menuAsistencia, show: false });
                  await actualizarAsistencia(menuAsistencia.post.id, menuAsistencia.dia, false);
                  cargarData();
                }
              }}
              className="w-full px-4 py-2.5 text-left text-sm font-semibold text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
            >
              <div className="w-2 h-2 rounded-full bg-red-500" /> Marcar Falta
            </button>

            <div className="h-px bg-gray-100 my-1" />

            <button 
              onClick={async () => {
                setMenuAsistencia({ ...menuAsistencia, show: false });
                await anularAsistencia(menuAsistencia.post.id, menuAsistencia.dia);
                cargarData();
              }}
              className="w-full px-4 py-2.5 text-left text-sm font-medium text-gray-500 hover:bg-gray-100 flex items-center gap-3 transition-colors"
            >
              <div className="w-2 h-2 rounded-full bg-gray-300" /> Anular Registro
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Reclutamientos;