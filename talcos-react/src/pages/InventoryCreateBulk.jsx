import InventoryCreateBulkForm from "../components/InventoryCreateBulkForm";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/inventory-create-bulk.module.css";

function InventoryCreateBulk() {
  return (
    <ProtectedRoute>
      <section className={Style.inventoryCreateBulk}>
        <InventoryCreateBulkForm />
      </section>
    </ProtectedRoute>
  );
}

export default InventoryCreateBulk;
