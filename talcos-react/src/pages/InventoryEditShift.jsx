import InventoryEditForm from "../components/InventoryEditForm";
import ProtectedRoute from "../utils/ProtectedRoute";

import Style from "./styles/inventory-edit.module.css";

function InventoryEditShift() {
  const fields = [
    {
      name: "nombre_turno",
      label: "Nombre",
      placeholder: "Ingresa el nombre del turno",
      type: "text",
    },
    {
      name: "inicio_turno",
      label: "Hora de inicio",
      type: "time",
    },
    {
      name: "fin_turno",
      label: "Hora de finalización",
      type: "time",
    },
  ];

  return (
    <ProtectedRoute>
      <section className={Style.inventoryEdit}>
        <InventoryEditForm
          redirectPath="shift"
          fields={fields}
          dataId="id_turno"
          endpoint="turnos"
          nameError="el turno"
          nameConfirmation="Turno editado"
          title="Complete los datos para editar el turno"
          nameButton="turno"
        />
      </section>
    </ProtectedRoute>
  );
}

export default InventoryEditShift;
