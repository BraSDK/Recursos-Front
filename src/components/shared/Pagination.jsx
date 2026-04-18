import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, totalRecords, currentRecordsCount, onPageChange }) => {
  if (totalPages <= 1 && totalRecords <= currentRecordsCount) return null;

  return (
    <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm mt-4">
      <div className="text-sm text-gray-500 font-medium">
        Mostrando <span className="font-bold text-gray-900">{currentRecordsCount}</span> de <span className="font-bold text-gray-900">{totalRecords}</span> registros
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
          Página {currentPage} de {totalPages}
        </div>

        <button 
          disabled={currentPage === totalPages}
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