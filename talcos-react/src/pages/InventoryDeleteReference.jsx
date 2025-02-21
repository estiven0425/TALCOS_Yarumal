import InventoryDeleteReferenceConfirmation from "../components/InventoryDeleteReferenceConfirmation";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/inventory-delete-reference.module.css";

function InventoryDeleteReference() {
  return (
    <ProtectedRoute>
      <section className={Style.inventoryDeleteReference}>
        <InventoryDeleteReferenceConfirmation />
      </section>
    </ProtectedRoute>
  );
}

export default InventoryDeleteReference;
