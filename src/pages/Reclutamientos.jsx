import { useEffect, useState } from 'react';
import { getPostulantes, actualizarAsistencia, anularAsistencia } from '../services/postulanteService';
import DetallePostulanteModal from '../components/postulacion/DetallePostulanteModal';
import ReclutamientoTable from '../components/reclutamientos/ReclutamientoTable';
import EditarPostulanteModal from '../components/postulacion/EditarPostulanteModal';
import { Search, UserPlus } from 'lucide-react';

const Reclutamientos = () => {
  const [postulantes, setPostulantes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // ESTADOS PARA EL MODAL DE DETALLE
  const [showDetalle, setShowDetalle] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedPostulante, setSelectedPostulante] = useState(null);
  // En Reclutamientos.jsx, añade este estado:
  const [menuAsistencia, setMenuAsistencia] = useState({ show: false, post: null, dia: null, x: 0, y: 0 });

  // Creamos un estado para alternar entre "Activos" e "Historial"
  const [view, setView] = useState("active"); // "active" o "history"

  useEffect(() => {
    cargarData();
  }, []);

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

  const cargarData = async () => {
    try {
      setLoading(true);
      const data = await getPostulantes();
      setPostulantes(data);
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

    // 2. Filtro por Vista (Activo vs Historial)
    const isHistory = post.estado_proceso === 'gestion' || post.estado_proceso === 'no_apto';
    const matchesView = view === "active" ? !isHistory : isHistory;

    // AMBOS deben ser verdaderos
    return matchesSearch && matchesView;
  });

  // Nueva función para guardar los cambios del modal de edición
  const handleUpdatePostulante = async (datosEditados) => {
    try {
      setLoading(true);
      // Aquí llamarías a tu servicio de actualización, ej:
      // await updatePostulante(datosEditados.id, datosEditados);
      await cargarData();
      setShowEdit(false);
    } catch (error) {
      alert("Error al actualizar los datos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Pipeline de Reclutamiento</h2>
          <p className="text-sm text-gray-500">Gestión de grupos semanales y capacitación de nuevos talentos.</p>
        </div>
        <div className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg font-semibold text-sm">
          <UserPlus size={18} /> {filtered.length} Postulantes
        </div>
      </div>

      <div className="flex gap-4 mb-4 border-b border-gray-200">
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

      <div className="mb-6 relative">
        <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
        <input 
          type="text" 
          placeholder="Buscar por nombre o DNI..." 
          className="pl-10 w-full border border-gray-300 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Tabla Componentizada */}
      <ReclutamientoTable 
        postulantes={filtered}
        onAsistencia={handleOpenMenu}
        onOpenDetalle={(post) => { setSelectedPostulante(post); setShowDetalle(true); }}
        onOpenEdit={(post) => { setSelectedPostulante(post); setShowEdit(true); }}
        loading={loading}
      />

      {/* Modal de Detalle */}
      <DetallePostulanteModal 
        show={showDetalle} 
        onClose={() => setShowDetalle(false)} 
        postulante={selectedPostulante}
        onUpdateFoto={async () => await cargarData()}
      />

      {/* Modal de Edición */}
      <EditarPostulanteModal 
        show={showEdit} 
        onClose={() => setShowEdit(false)} 
        postulante={selectedPostulante}
        onUpdate={handleUpdatePostulante}
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