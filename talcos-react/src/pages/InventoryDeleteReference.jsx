import InventoryDeleteConfirmation from "../components/InventoryDeleteConfirmation";
import ProtectedRoute from "../utils/ProtectedRoute";

import Style from "./styles/inventory-delete.module.css";

function InventoryDeleteReference() {
  return (
    <ProtectedRoute>
      <section className={Style.inventoryDelete}>
        <InventoryDeleteConfirmation
          dataId="id_referencia"
          redirectPath="reference"
          endpoint="referencias/eliminarreferencia"
          name="actividad_referencia"
          nameError="la referencia"
          nameConfirmation="Referencia eliminada"
          title="¿Seguro que desea eliminar la referencia seleccionada?"
          nameButton="referencia"
        />
      </section>
    </ProtectedRoute>
  );
}

export default InventoryDeleteReference;
