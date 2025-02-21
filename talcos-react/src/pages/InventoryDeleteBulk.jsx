import InventoryDeleteBulkConfirmation from "../components/InventoryDeleteBulkConfirmation";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/inventory-delete-bulk.module.css";

function InventoryDeleteBulk() {
  return (
    <ProtectedRoute>
      <section className={Style.inventoryDeleteBulk}>
        <InventoryDeleteBulkConfirmation />
      </section>
    </ProtectedRoute>
  );
}

export default InventoryDeleteBulk;
