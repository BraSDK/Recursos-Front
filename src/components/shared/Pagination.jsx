import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ meta, currentPage, totalPages, totalRecords, currentRecordsCount, onPageChange }) => {
  // Extraemos datos de meta (estilo Laravel)
  const { last_page, total } = meta;

  // Si total es 0, no hay registros, pero solo mostramos null si también es la única página
  //if (total === 0) return null;

  // Si no hay más de una página y no hay registros, no mostramos nada
  if (last_page <= 1 && total <= currentRecordsCount) return null;

  return (
    <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm mt-4">
      <div className="text-sm text-gray-500 font-medium">
        Mostrando <span className="font-bold text-gray-900">{currentRecordsCount}</span> de <span className="font-bold text-gray-900">{total}</span> registros
      </div>
      
      <div className="flex items-center gap-2">
        <button 
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-gray-600"
        >
          <ChevronLeft size={20} />
        </button>
        
        <div className="flex items-center px-4 text-sm font-bold text-gray-700 bg-gray-50 py-2 rounded-lg border border-gray-100">
          Página {currentPage} de {last_page}
        </div>

        <button 
          disabled={currentPage === last_page}
          onClick={() => onPageChange(currentPage + 1)}
          className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-gray-600"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;