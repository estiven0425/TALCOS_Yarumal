import InventoryAggregateListDetail from "../components/InventoryAggregateListDetail.jsx";
import ProtectedRoute from "../utils/ProtectedRoute";

import Style from "./styles/inventory-raw-material-register.module.css";

function InventoryAggregateDetail() {
  return (
    <ProtectedRoute>
      <section className={Style.inventoryRawMaterialRegister}>
        <InventoryAggregateListDetail />
      </section>
    </ProtectedRoute>
  );
}

export default InventoryAggregateDetail;
