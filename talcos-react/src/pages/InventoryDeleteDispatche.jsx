import InventoryDeleteConfirmation from "../components/InventoryDeleteConfirmation";
import ProtectedRoute from "../utils/ProtectedRoute";

import Style from "./styles/inventory-delete.module.css";

function InventoryDeleteDispatche() {
  return (
    <ProtectedRoute>
      <section className={Style.inventoryDelete}>
        <InventoryDeleteConfirmation
          dataId="id_despacho"
          redirectPath="dispatche"
          endpoint="despachos/eliminardespacho"
          name="actividad_despacho"
          nameError="el despacho"
          nameConfirmation="Despacho eliminado"
          title="¿Seguro que desea eliminar el despacho seleccionado?"
          nameButton="despacho"
        />
      </section>
    </ProtectedRoute>
  );
}

export default InventoryDeleteDispatche;
