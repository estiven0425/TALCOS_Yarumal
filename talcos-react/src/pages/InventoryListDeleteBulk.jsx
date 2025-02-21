import InventoryListDeleteBulkTable from "../components/InventoryListDeleteBulkTable";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/inventory-list-delete-bulk.module.css";

function InventoryListDeleteBulk() {
  return (
    <ProtectedRoute>
      <section className={Style.inventoryListDeleteBulk}>
        <InventoryListDeleteBulkTable />
      </section>
    </ProtectedRoute>
  );
}

export default InventoryListDeleteBulk;
