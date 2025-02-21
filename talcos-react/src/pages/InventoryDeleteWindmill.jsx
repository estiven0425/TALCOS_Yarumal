import InventoryDeleteWindmillConfirmation from "../components/InventoryDeleteWindmillConfirmation";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/inventory-delete-windmill.module.css";

function InventoryDeleteWindmill() {
  return (
    <ProtectedRoute>
      <section className={Style.inventoryDeleteWindmill}>
        <InventoryDeleteWindmillConfirmation />
      </section>
    </ProtectedRoute>
  );
}

export default InventoryDeleteWindmill;
