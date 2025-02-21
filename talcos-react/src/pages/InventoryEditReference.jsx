import InventoryEditReferenceForm from "../components/InventoryEditReferenceForm";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/inventory-edit-reference.module.css";

function InventoryEditReference() {
  return (
    <ProtectedRoute>
      <section className={Style.inventoryEditReference}>
        <InventoryEditReferenceForm />
      </section>
    </ProtectedRoute>
  );
}

export default InventoryEditReference;
