import { Modal, Button, Label, TextInput, Select } from "flowbite-react";
import { useState, useEffect } from "react";

const EmpleadoModal = ({ show, onClose, onSave, empleado, puestos }) => {
  // Estado inicial dinámico: si hay un 'empleado', es modo edición
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    dni: "",
    puesto_id: "",
  });

  useEffect(() => {
    if (empleado) {
      setFormData(empleado); // Cargamos datos si es edición
    } else {
      setFormData({ nombres: "", apellidos: "", dni: "", puesto_id: "" });
    }
  }, [empleado]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal show={show} onClose={onClose}>
      <Modal.Header>{empleado ? "Editar Empleado" : "Nuevo Empleado"}</Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nombres" value="Nombres" />
            <TextInput
              id="nombres"
              value={formData.nombres}
              onChange={(e) => setFormData({ ...formData, nombres: e.target.value })}
              required
            />
          </div>
          {/* ... Repetir para Apellidos y DNI ... */}
          <div>
            <Label htmlFor="puesto" value="Puesto" />
            <Select 
                id="puesto" 
                value={formData.puesto_id}
                onChange={(e) => setFormData({ ...formData, puesto_id: e.target.value })}
            >
              <option value="">Seleccione un puesto</option>
              {puestos.map(p => <option key={p.id} value={p.id}>{p.nombre_puesto}</option>)}
            </Select>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button color="gray" onClick={onClose}>Cancelar</Button>
            <Button type="submit" color="blue">Guardar</Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default EmpleadoModal;