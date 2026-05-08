import DrawerPlanificacion from './DrawerPlanificacion';

const CapacitacionDrawer = ({ show, onClose, onSelectGrupo, onClear }) => {
  return (
    <DrawerPlanificacion
      show={show}
      onClose={onClose}
      onSelectGrupo={onSelectGrupo}
      onClearFilters={onClear}
    />
  );
};
export default CapacitacionDrawer;