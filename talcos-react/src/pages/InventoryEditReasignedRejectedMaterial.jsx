import InventoryEditReasignedRejectedMaterialForm from "../components/InventoryEditReasignedRejectedMaterialForm";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/inventory-edit.module.css";

function InventoryEditReasignedRejectedMaterial() {
  return (
    <ProtectedRoute>
      <section className={Style.inventoryEdit}>
        <InventoryEditReasignedRejectedMaterialForm />
      </section>
    </ProtectedRoute>
  );
}

export default InventoryEditReasignedRejectedMaterial;
