import InventoryListDeleteTableInventoryAp from "../components/InventoryListDeleteTableInventoryAp";
import ProtectedRoute from "../utils/ProtectedRoute";

import Style from "./styles/inventory-list.module.css";

function InventoryListDeleteInventoryAp() {
  return (
    <ProtectedRoute>
      <section className={Style.inventoryList}>
        <InventoryListDeleteTableInventoryAp />
      </section>
    </ProtectedRoute>
  );
}

export default InventoryListDeleteInventoryAp;
