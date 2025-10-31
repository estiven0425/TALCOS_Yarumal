import InventoryDeleteConfirmation from "../components/InventoryDeleteConfirmation";
import ProtectedRoute from "../utils/ProtectedRoute";

import Style from "./styles/inventory-delete.module.css";

function InventoryDeleteParo() {
  return (
    <ProtectedRoute>
      <section className={Style.inventoryDelete}>
        <InventoryDeleteConfirmation
          dataId="id_paro"
          redirectPath="paro"
          endpoint="paros/eliminarparo"
          name="actividad_paro"
          nameError="el tipo de paro"
          nameConfirmation="Tipo de paro eliminado"
          title="¿Seguro que desea eliminar el tipo de paro seleccionado?"
          nameButton="tipo de paro"
        />
      </section>
    </ProtectedRoute>
  );
}

export default InventoryDeleteParo;
