import { useEffect, useState, useCallback } from 'react';
import { getPostulantes } from '../services/postulanteService';

export const usePostulantes = () => {
  const [postulantes, setPostulantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]); // <-- Faltaba esto
  const [meta, setMeta] = useState({ 
    current_page: 1, 
    last_page: 1, 
    total: 0 
  });

  // Usamos useCallback para que la función no cambie en cada render
  const cargarData = useCallback(async (page = currentPage, search = searchTerm) => {
    setLoading(true);
    try {
      const res = await getPostulantes(page, search);
      // Ajustamos según la estructura de tu API de Laravel
      setPostulantes(res.data || []);
      setMeta({
        current_page: res.current_page,
        last_page: res.last_page,
        total: res.total
      });
    } catch (error) {
      console.error("Error al cargar postulantes:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm]);

  // Efecto para cargar data cuando cambie página o búsqueda
  useEffect(() => {
    cargarData();
  }, [cargarData]);

  return { 
    postulantes, 
    loading, 
    meta, 
    currentPage, 
    setCurrentPage, 
    searchTerm, 
    setSearchTerm, 
    selectedIds, 
    setSelectedIds, 
    cargarData 
  };
};