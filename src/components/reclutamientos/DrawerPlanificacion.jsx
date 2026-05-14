import { useEffect, useState } from "react";
import { X, Calendar, Clock, Plus, FilterX } from "lucide-react";
import { getGruposFiltrados } from "../../services/capacitacionService";
const DrawerPlanificacion = ({ show, onClose, onSelectGrupo, onClearFilters, tipo }) => {
    const [isAnimate, setIsAnimate] = useState(false);
    const [grupos, setGrupos] = useState([]);
    const [areaFiltro, setAreaFiltro] = useState("ventas");

    // Sincronizar animación con la prop 'show'
    useEffect(() => {
      if (show) {
        setTimeout(() => setIsAnimate(true), 10);
        cargarGrupos();
      } else {
        setIsAnimate(false);
      }
    }, [show, areaFiltro, tipo]);

    const cargarGrupos = async () => {
      try {
        // Usamos el servicio para traer grupos del área seleccionada
        const data = await getGruposFiltrados({ area_general: areaFiltro, tipo: tipo });
        setGrupos(data);
      } catch (error) {
        console.error("Error al cargar grupos:", error);
      }
    };

    const handleClose = () => {
      setIsAnimate(false);
      setTimeout(onClose, 300); // Esperar a que termine la animación (300ms)
    };

    // Renderizar solo si se está mostrando o si está animando el cierre
    if (!show && !isAnimate) return null;
    
      return (
        <div className="fixed inset-0 z-[100] flex justify-end overflow-hidden">
          {/* Backdrop con desvanecimiento */}
          <div 
            className={`absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${
              isAnimate ? "opacity-100" : "opacity-0"
            }`} 
            onClick={handleClose} 
          />
          
          {/* Drawer Lateral con transformación */}
          <div className={`relative bg-white w-96 h-full shadow-2xl flex flex-col transition-transform duration-300 ease-in-out transform ${
            isAnimate ? "translate-x-0" : "translate-x-full"
          }`}>
            
            {/* Header */}
            <div className="p-6 border-b flex justify-between items-center">
              <div>
                  <h2 className="font-bold text-gray-900">Agenda de Capacitación</h2>
                  <button 
                    onClick={onClearFilters} 
                    className="flex items-center gap-1 mt-1 text-[10px] font-bold text-red-500 hover:text-red-700 uppercase transition-colors"
                  >
                    <FilterX size={12} /> Limpiar filtros
                  </button>
                </div>
              <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400"><X size={20} /></button>
            </div>
    
            {/* Contenido */}
            <div className="p-4 space-y-4 flex-1 overflow-y-auto">
              {/* Botones de Filtro */}
              <div className="flex gap-2">
                {['ventas', 'operaciones', 'administracion'].map((area) => (
                  <button 
                    key={area}
                    onClick={() => setAreaFiltro(area)}
                    className={`flex-1 text-[10px] font-bold uppercase py-2 rounded-lg transition-all ${
                      areaFiltro === area ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {area}
                  </button>
                ))}
              </div>
                
              {/* Lista de Grupos Reales */}
              <div className="space-y-2 mt-4">
              {grupos.length > 0 ? (
                grupos.map(g => (
                  <div 
                    key={g.id}
                    onClick={() => onSelectGrupo(g.id, g.fecha_capacitacion)} 
                    className="p-4 border rounded-xl hover:border-indigo-500 cursor-pointer transition-all hover:bg-indigo-50/50"
                  >
                    <p className="font-bold text-sm text-gray-900">{g.nombre_grupo}</p>
                    <div className="flex items-center gap-4 text-[10px] text-gray-400 mt-2">
                      <span className="flex items-center gap-1"><Calendar size={10}/> {g.fecha_capacitacion}</span>
                      <span className="flex items-center gap-1"><Clock size={10}/> {g.hora_capacitacion}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-gray-400 text-sm italic">
                  No hay grupos en {areaFiltro}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };
    
export default DrawerPlanificacion;