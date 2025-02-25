import InventoryDeleteRawMaterialConfirmation from "../components/InventoryDeleteRawMaterialConfirmation";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/inventory-delete-raw-material.module.css";

function InventoryDeleteRawMaterial() {
  return (
    <ProtectedRoute>
      <section className={Style.inventoryDeleteRawMaterial}>
        <InventoryDeleteRawMaterialConfirmation />
      </section>
    </ProtectedRoute>
  );
}

export default InventoryDeleteRawMaterial;
