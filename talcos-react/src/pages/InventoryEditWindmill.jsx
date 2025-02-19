import InventoryEditWindmillForm from "../components/InventoryEditWindmillForm";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/inventory-edit-windmill.module.css";

function InventoryEditWindmill() {
  return (
    <ProtectedRoute>
      <section className={Style.inventoryEditWindmill}>
        <InventoryEditWindmillForm />
      </section>
    </ProtectedRoute>
  );
}

export default InventoryEditWindmill;
