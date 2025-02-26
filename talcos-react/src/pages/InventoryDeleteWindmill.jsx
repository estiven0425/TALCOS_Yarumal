import InventoryDeleteConfirmation from "../components/InventoryDeleteConfirmation";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/inventory-delete.module.css";

function InventoryDeleteWindmill() {
  return (
    <ProtectedRoute>
      <section className={Style.inventoryDelete}>
        <InventoryDeleteConfirmation
          dataId="id_molino"
          redirectPath="windmill"
          endpoint="molinos/eliminarmolino"
          name="actividad_molino"
          nameError="el molino"
          nameConfirmation="Molino eliminado"
          title="¿Seguro que desea eliminar el molino seleccionado?"
          nameButton="molino"
        />
      </section>
    </ProtectedRoute>
  );
}

export default InventoryDeleteWindmill;
