import InventoryEditBulkForm from "../components/InventoryEditBulkForm";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/inventory-edit-bulk.module.css";

function InventoryEditBulk() {
  return (
    <ProtectedRoute>
      <section className={Style.inventoryEditBulk}>
        <InventoryEditBulkForm />
      </section>
    </ProtectedRoute>
  );
}

export default InventoryEditBulk;
