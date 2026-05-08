import { useState, useEffect, useCallback } from 'react';
import { getEventosCalendario, crearGrupo, updateGrupo } from '@/services/capacitacionService';

export const useCapacitacion = () => {
    const [eventos, setEventos] = useState([]);
    const [loading, setLoading] = useState(true);

    const cargarData = useCallback(async () => {
      setLoading(true);
      try {
          const data = await getEventosCalendario();
          setEventos(data);
      } catch (error) {
          console.error("Error cargando eventos:", error);
      } finally {
          setLoading(false);
      }
    }, []);

    useEffect(() => {
      cargarData();
    }, [cargarData]);

    const guardarEvento = async (formData) => {
      try {
        if (formData.id) {
          await updateGrupo(formData.id, formData);
        } else {
          await crearGrupo(formData);
        }
        await cargarData();
        return { success: true };
      } catch (error) {
        console.error("Error al guardar:", error);
        throw error;
      }
    };

    const eliminarEvento = async (id) => {
      try {
          await deleteGrupo(id);
          await cargarData();
          return { success: true };
      } catch (error) {
          console.error("Error al eliminar:", error);
          throw error;
      }
    };

    return {
        eventos,
        loading,
        guardarEvento,
        eliminarEvento,
        refrescar: cargarData
    }
}