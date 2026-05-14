import React, { useState, useEffect } from 'react';
import DrawerPlanificacion from './DrawerPlanificacion';
import { getGruposAbiertos } from '../../services/capacitacionService';

const CapacitacionDrawer = ({ show, onClose, onSelectGrupo, onClear, tipo }) => {
  const [grupos, setGrupos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show) {
      fetchGrupos();
    }
  }, [show, tipo]);

  const fetchGrupos = async () => {
     (true);
    try {
      // Usamos el servicio pasándole el tipo para filtrar en el Backend
      const data = await getGruposAbiertos(tipo); 
      setGrupos(data);
    } catch (error) {
      console.error("Error al cargar grupos en drawer:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DrawerPlanificacion
      show={show}
      onClose={onClose}
      grupos={grupos}
      loading={loading}
      onSelectGrupo={onSelectGrupo}
      onClearFilters={onClear}
      tipo={tipo}
    />
  );
};
export default CapacitacionDrawer;