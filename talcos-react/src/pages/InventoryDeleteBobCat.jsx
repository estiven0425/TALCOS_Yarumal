import InventoryDeleteConfirmation from "../components/InventoryDeleteConfirmation";
import ProtectedRoute from "../utils/ProtectedRoute";

import Style from "./styles/inventory-delete.module.css";

function InventoryDeleteBobCat() {
  return (
    <ProtectedRoute>
      <section className={Style.inventoryDelete}>
        <InventoryDeleteConfirmation
          dataId="id_bob_cat"
          redirectPath="bobcat"
          endpoint="bob_cats/eliminarbobcat"
          name="actividad_bob_cat"
          nameError="el bob - cat"
          nameConfirmation="Bob - cat eliminado"
          title="¿Seguro que desea eliminar el bob - cat seleccionado?"
          nameButton="bob - cat"
        />
      </section>
    </ProtectedRoute>
  );
}

export default InventoryDeleteBobCat;
