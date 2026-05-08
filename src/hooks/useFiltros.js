import { useState, useMemo } from 'react';

export const useFiltros = (postulantes, searchTerm) => {
    const [view, setView] = useState("active");
    const [filtroGrupo, setFiltroGrupo] = useState(null);
    const [areaActiva, setAreaActiva] = useState("todos");
  
    const normalize = (text) =>
      text?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
    const filtered = useMemo(() => {
        const term = normalize(searchTerm);

        return postulantes.filter(post => {
          const nombreCompleto = normalize(
            `${post.nombres} ${post.apellido_paterno} ${post.apellido_materno}`
          );
    
          // 1. Filtro búsqueda
          const matchesSearch =
            nombreCompleto.includes(term) ||
            post.dni?.toString().includes(term) ||
            normalize(post.horario_interes).includes(term);
    
          // 2. Filtro vista
          const isHistory =
            post.estado_proceso === 'gestion' ||
            post.estado_proceso === 'no_apto';
    
          const matchesView =
            view === "active" ? !isHistory : isHistory;
    
          // 3. Filtro grupo
          let matchesGrupo = true;
          if (filtroGrupo === 'sin_asignar') {
            matchesGrupo = !post.grupo_id;
          } else if (filtroGrupo !== null) {
            matchesGrupo = post.grupo_id === filtroGrupo;
          }
    
          // 4. Filtro área
          const matchesArea =
            areaActiva === "todos"
              ? true
              : post.area_general === areaActiva;
    
          return matchesSearch && matchesView && matchesGrupo && matchesArea;
        });
      }, [postulantes, searchTerm, view, filtroGrupo, areaActiva]);
  
    return {
      filtered,
      view,
      setView,
      filtroGrupo,
      setFiltroGrupo,
      areaActiva,
      setAreaActiva
    };
  };