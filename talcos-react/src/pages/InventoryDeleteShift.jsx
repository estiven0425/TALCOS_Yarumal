import InventoryDeleteConfirmation from "../components/InventoryDeleteConfirmation";
import ProtectedRoute from "../utils/ProtectedRoute";

import Style from "./styles/inventory-delete.module.css";

function InventoryDeleteShift() {
  return (
    <ProtectedRoute>
      <section className={Style.inventoryDelete}>
        <InventoryDeleteConfirmation
          dataId="id_turno"
          redirectPath="shift"
          endpoint="turnos/eliminarturno"
          name="actividad_turno"
          nameError="el turno"
          nameConfirmation="Turno eliminado"
          title="¿Seguro que desea eliminar el turno seleccionado?"
          nameButton="turno"
        />
      </section>
    </ProtectedRoute>
  );
}

export default InventoryDeleteShift;
