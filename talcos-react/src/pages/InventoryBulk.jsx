import InventoryBulkButton from "../components/InventoryBulkButton";
import InventoryBulkList from "../components/InventoryBulkList";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/inventory-bulk.module.css";

function InventoryBulk() {
  return (
    <ProtectedRoute>
      <section className={Style.inventoryBulk}>
        <InventoryBulkButton />
        <main className={Style.inventoryBulkMain}>
          <InventoryBulkList />
        </main>
      </section>
    </ProtectedRoute>
  );
}

export default InventoryBulk;
