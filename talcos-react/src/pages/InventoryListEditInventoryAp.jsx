import InventoryListEditTableInventoryAp from "../components/InventoryListEditTableInventoryAp";
import ProtectedRoute from "../utils/ProtectedRoute";

import Style from "./styles/inventory-list.module.css";

function InventoryListEditInventoryAp() {
  return (
    <ProtectedRoute>
      <section className={Style.inventoryList}>
        <InventoryListEditTableInventoryAp />
      </section>
    </ProtectedRoute>
  );
}

export default InventoryListEditInventoryAp;
