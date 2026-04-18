import { Search, Filter, X } from 'lucide-react';

const PuestoFilters = ({ searchTerm, setSearchTerm, selectedDep, setSelectedDep, departamentos }) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6 animate-in fade-in duration-500">
      {/* Input de Búsqueda */}
      <div className="flex-1 relative group">
        <Search className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-blue-600 transition-colors w-5 h-5" />
        <input 
          type="text" 
          placeholder="Buscar cargo o puesto..." 
          className="pl-12 w-full bg-white border border-gray-200 rounded-2xl py-3.5 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all shadow-sm font-medium"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Selector de Departamento */}
      <div className="relative min-w-[280px]">
        <Filter className="absolute left-4 top-4 text-gray-400 w-4 h-4" />
        <select 
          value={selectedDep}
          onChange={(e) => setSelectedDep(e.target.value)}
          className="pl-11 pr-10 w-full bg-white border border-gray-200 rounded-2xl py-3.5 outline-none appearance-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all shadow-sm font-bold text-gray-700 cursor-pointer"
        >
          <option value="">TODOS LOS DEPARTAMENTOS</option>
          {departamentos.map(dep => (
            <option key={dep.id} value={dep.id}>{dep.nombre}</option>
          ))}
        </select>
        
        {/* Botón para limpiar filtro de departamento */}
        {selectedDep !== "" ? (
          <button 
            onClick={() => setSelectedDep("")}
            className="absolute right-3 top-3.5 p-1 text-gray-400 hover:text-red-500 transition-colors"
          >
            <X size={18} />
          </button>
        ) : (
          <div className="absolute right-4 top-5 pointer-events-none text-gray-400 border-t-2 border-r-2 border-gray-400 w-2 h-2 rotate-[135deg]"></div>
        )}
      </div>
    </div>
  );
};

export default PuestoFilters;