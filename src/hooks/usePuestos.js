import { useState, useEffect, useCallback } from 'react';
import { getPuestos, createPuesto, updatePuesto, deletePuesto } from '../services/puestoService';

export const usePuestos = () => {
  const [puestos, setPuestos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDep, setSelectedDep] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [meta, setMeta] = useState({ last_page: 1, total: 0 });

  const cargarData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getPuestos({ 
        search: searchTerm, 
        departamento_id: selectedDep,
        page: currentPage
      });

      setPuestos(response.data || []);
      setMeta({
        last_page: response.last_page || 1,
        total: response.total || 0
      });
    } catch (error) {
      console.error("Error cargando puestos:", error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedDep, currentPage]);

  useEffect(() => {
    cargarData();
  }, [cargarData]);

  const guardarPuesto = async (datos, id = null) => {
    if (id) {
      await updatePuesto(id, datos);
    } else {
      await createPuesto(datos);
    }
    await cargarData();
  };

  const eliminarPuesto = async (id) => {
    await deletePuesto(id);
    await cargarData();
  };

  return {
    puestos,
    loading,
    meta,
    currentPage,
    setCurrentPage,
    searchTerm,
    setSearchTerm,
    selectedDep,
    setSelectedDep,
    guardarPuesto,
    eliminarPuesto,
    cargarData
  };
};