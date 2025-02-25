import InventoryEditRawMaterialForm from "../components/InventoryEditRawMaterialForm";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/inventory-edit-raw-material.module.css";

function InventoryEditRawMaterial() {
  return (
    <ProtectedRoute>
      <section className={Style.inventoryEditRawMaterial}>
        <InventoryEditRawMaterialForm />
      </section>
    </ProtectedRoute>
  );
}

export default InventoryEditRawMaterial;
