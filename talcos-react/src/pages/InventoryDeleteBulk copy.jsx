import InventoryDeleteConfirmation from "../components/InventoryDeleteConfirmation";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/inventory-delete.module.css";

function InventoryDeleteBulk() {
  return (
    <ProtectedRoute>
      <section className={Style.inventoryDelete}>
        <InventoryDeleteConfirmation
          dataId="id_bulto"
          redirectPath="bulk"
          endpoint="bultos/eliminarbulto"
          name="actividad_bulto"
          nameError="el bulto"
          nameConfirmation="Bulto eliminado"
          title="¿Seguro que desea eliminar el bulto seleccionado?"
          nameButton="bulto"
        />
      </section>
    </ProtectedRoute>
  );
}

export default InventoryDeleteBulk;
