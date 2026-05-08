const BulkActions = ({ selectedIds, onAsignar }) => {
  if (selectedIds.length === 0) return null;

  return (
    <div className="fixed bottom-8 right-8 bg-gray-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 z-50">
      <span className="font-bold text-sm">
        {selectedIds.length} seleccionados
      </span>

      <button
        onClick={onAsignar}
        className="bg-indigo-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 flex items-center gap-2"
      >
        Asignar a Capacitación
      </button>
    </div>
  );
};
export default BulkActions;