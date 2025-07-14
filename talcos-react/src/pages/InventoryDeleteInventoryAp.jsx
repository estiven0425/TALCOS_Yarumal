import InventoryDeleteConfirmation from "../components/InventoryDeleteConfirmation";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/inventory-delete.module.css";

function InventoryDeleteInventoryAp() {
  return (
    <ProtectedRoute>
      <section className={Style.inventoryDelete}>
        <InventoryDeleteConfirmation
          dataId="id_inventario_ap"
          redirectPath="inventoryap"
          endpoint="inventario_ap/eliminarinventarioap"
          name="actividad_inventario_ap"
          nameError="el inventario AP"
          nameConfirmation="Inventario AP eliminado"
          title="¿Seguro que desea eliminar el inventario AP seleccionado?"
          nameButton="inventario AP"
        />
      </section>
    </ProtectedRoute>
  );
}

export default InventoryDeleteInventoryAp;
