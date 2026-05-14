import React, { useState, useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es'; // Para que esté en español
import CapacitacionModal from '@/components/capacitacion/CapacitacionModal';
import CapacitacionDrawer from '@/components/reclutamientos/CapacitacionDrawer';
import { useCapacitacion } from '@/hooks/useCapacitacion';
import { CalendarRange, Plus, Loader2, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

const Capacitaciones = () => {
  // useCapacitacion - Hook
  const {eventos, loading, guardarEvento, eliminarEvento} = useCapacitacion();

  // 2. Creamos la referencia para manipular FullCalendar
  const calendarRef = useRef(null);

  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null); // Para editar

  const [showDrawer, setShowDrawer] = useState(false);
  const [filtroGrupo, setFiltroGrupo] = useState(null);

  // Filtramos los eventos localmente si hay un grupo seleccionado en el Drawer
  const eventosFiltrados = filtroGrupo 
    ? eventos.filter(e => e.id.toString() === filtroGrupo.toString())
    : eventos;

  const handleEventClick = (info) => {
    // Mapeamos los datos del evento de FullCalendar de vuelta a nuestro formato de formulario
    setSelectedEvent({
      id: info.event.id,
      nombre_grupo: info.event.title,
      area_general: info.event.extendedProps.area,
      fecha_capacitacion: info.event.startStr.split('T')[0],
      hora_capacitacion: info.event.startStr.split('T')[1].substring(0, 5),
      estado: info.event.extendedProps.estado
    });
    setShowModal(true);
  };
  
  const handleDateSelect = (info) => {
    setSelectedEvent({
      fecha_capacitacion: info.startStr,
      hora_capacitacion: '09:00',
      area_general: 'ventas',
      estado: 'abierto'
    });
    setShowModal(true);
  };

  const onSave = async (data) => {
    try {
      await guardarEvento(data);
      setShowModal(false);
    } catch (e) {
      alert("Error al procesar la solicitud");
    }
  };

  const onDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este grupo?")) {
      await eliminarEvento(id);
      setShowModal(false);
    }
  };

  // Renderizado personalizado del evento (Las cajitas de colores)
  const renderEventContent = (eventInfo) => {
    const area = eventInfo.event.extendedProps.area;
    const tipo = eventInfo.event.extendedProps.tipo;
    // Colores pastel tipo la imagen
    const areaColors = {
      ventas: "bg-indigo-100 text-indigo-700 border-indigo-200",
      operaciones: "bg-emerald-100 text-emerald-700 border-emerald-200",
      administracion: "bg-amber-100 text-amber-700 border-amber-200"
    };

    // Color de fondo según el TIPO
    const bgColor = tipo === 'preseleccion' ? 'bg-rose-50' : 'bg-slate-50';
    const borderColor = tipo === 'preseleccion' ? 'border-rose-200' : areaColors[area];

    return (
      <div className={`p-1.5 w-full rounded-lg border shadow-sm ${bgColor} ${borderColor} ${areaColors[area]}`}>
        <div className="flex justify-between items-center">
        <div className="font-bold text-[10px] truncate">{eventInfo.event.title}</div>
        {/* Badge pequeño para identificar tipo visualmente */}
        <span className={`text-[8px] px-1 rounded ${tipo === 'preseleccion' ? 'bg-rose-200 text-rose-700' : 'bg-slate-200'}`}>
          {tipo === 'preseleccion' ? 'PRE' : 'CAP'}
        </span>
      </div>
      <div className="text-[9px] opacity-80">{eventInfo.timeText}</div>
    </div>
    );
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
      {/* Header Estilo Moderno */}
      <div className="flex justify-between items-start mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800">Horarios de Capacitacion</h1>
          <p className="text-slate-400 text-sm mt-1">Gestiona las capacitaciones de hoy.</p>
        </div>
        <div className="flex gap-3">
            {/* Botón de Filtro */}
            <button 
              onClick={() => setShowDrawer(true)}
              className={`px-4 py-3 rounded-2xl font-bold transition-all shadow-sm flex items-center gap-2 border ${
                filtroGrupo ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Filter size={20} /> {filtroGrupo ? 'Filtrado' : 'Filtros'}
            </button>

            <button 
              onClick={() => { setSelectedEvent(null); setShowModal(true); }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-200 flex items-center gap-2"
            >
              <Plus size={20} /> Add
            </button>
          </div>
        </div>

      {/* Calendario con estilo de tarjeta flotante */}
      <div className="bg-white rounded-[32px] shadow-2xl shadow-slate-200/60 p-8 relative border border-slate-50">
        {loading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-20 flex items-center justify-center rounded-[32px]">
            <Loader2 className="animate-spin text-indigo-500" size={48} />
          </div>
        )}
        
        <FullCalendar
            ref={calendarRef} // <-- 3. CONEXIÓN DEL REF AQUÍ
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            locale={esLocale}
            aspectRatio={1.6}
            contentHeight={600}
            
            headerToolbar={{
              left: 'title prev,next',
              center: '',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            buttonText={{ month: 'Month', week: 'Week', day: 'Day' }}
            dayHeaderFormat={{ weekday: 'short' }}
            
            events={eventosFiltrados} // <-- 4. PASAMOS LOS EVENTOS FILTRADOS
            editable={true}
            selectable={true}
            eventClassNames="bg-transparent border-none shadow-none p-0" 
            eventClick={handleEventClick}
            select={handleDateSelect}
            eventContent={renderEventContent}
            dayMaxEvents={2}
          />
      </div>

      {/* Legend estilizada */}
      <div className="mt-8 flex gap-4">
        <LegendItem dot="bg-indigo-500" label="Ventas" />
        <LegendItem dot="bg-emerald-500" label="Operaciones" />
        <LegendItem dot="bg-amber-500" label="Administración" />
      </div>

      <CapacitacionModal 
        show={showModal}
        onClose={() => setShowModal(false)}
        initialData={selectedEvent}
        onSave={async (data) => {
          await guardarEvento(data);
          setShowModal(false);
        }}
        onDelete={async (id) => {
          await eliminarEvento(id);
          setShowModal(false);
        }}
      />

      <CapacitacionDrawer 
          show={showDrawer}
          onClose={() => setShowDrawer(false)}
          onSelectGrupo={(grupoId, fecha) => {
            setFiltroGrupo(grupoId); // Oculta los demás eventos
            setShowDrawer(false);

            // Hace que el calendario salte mágicamente a la fecha seleccionada
            if (fecha && calendarRef.current) {
              const calendarApi = calendarRef.current.getApi();
              calendarApi.gotoDate(fecha);
            }
          }}
          onClear={() => {
            setFiltroGrupo(null); // Muestra todos los eventos de nuevo
            setShowDrawer(false);
            
            // Regresa al mes actual
            if (calendarRef.current) {
               calendarRef.current.getApi().today();
            }
          }}
        />
      </div>  
    </div>
  );
};

const LegendItem = ({ dot, label }) => (
  <div className="bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3 transition-hover hover:shadow-md cursor-default">
    <span className={`w-2 h-2 rounded-full ${dot}`}></span>
    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</span>
  </div>
);

export default Capacitaciones;