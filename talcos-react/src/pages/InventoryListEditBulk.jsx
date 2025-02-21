import InventorytListEditBulkTable from "../components/InventoryListEditBulkTable";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/inventory-list-edit-bulk.module.css";

function InventoryListEditBulk() {
  return (
    <ProtectedRoute>
      <section className={Style.inventorytListEditBulk}>
        <InventorytListEditBulkTable />
      </section>
    </ProtectedRoute>
  );
}

export default InventoryListEditBulk;
