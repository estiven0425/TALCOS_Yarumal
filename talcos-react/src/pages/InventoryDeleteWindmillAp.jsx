import InventoryDeleteConfirmation from "../components/InventoryDeleteConfirmation";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/inventory-delete.module.css";

function InventoryDeleteWindmillAp() {
  return (
    <ProtectedRoute>
      <section className={Style.inventoryDelete}>
        <InventoryDeleteConfirmation
          dataId="id_molino_ap"
          redirectPath="windmillap"
          endpoint="molinos_ap/eliminarmolino"
          name="actividad_molino_ap"
          nameError="el molino AP"
          nameConfirmation="Molino AP eliminado"
          title="¿Seguro que desea eliminar el molino AP seleccionado?"
          nameButton="molino AP"
        />
      </section>
    </ProtectedRoute>
  );
}

export default InventoryDeleteWindmillAp;
