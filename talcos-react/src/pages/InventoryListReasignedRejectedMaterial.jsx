import InventoryListReasignedRejectedMaterialTable from "../components/InventoryListReasignedRejectedMaterialTable";
import ProtectedRoute from "../utils/ProtectedRoute";

import Style from "./styles/inventory-list.module.css";

function InventoryListEditRejectedMaterial() {
  return (
    <ProtectedRoute>
      <section className={Style.inventoryList}>
        <InventoryListReasignedRejectedMaterialTable />
      </section>
    </ProtectedRoute>
  );
}

export default InventoryListEditRejectedMaterial;
