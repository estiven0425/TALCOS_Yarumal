import InventoryListDeleteWindmillTable from "../components/InventoryListDeleteWindmillTable";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/inventory-list-delete-windmill.module.css";

function InventoryListDeleteWindmill() {
  return (
    <ProtectedRoute>
      <section className={Style.inventoryListDeleteWindmill}>
        <InventoryListDeleteWindmillTable />
      </section>
    </ProtectedRoute>
  );
}

export default InventoryListDeleteWindmill;
