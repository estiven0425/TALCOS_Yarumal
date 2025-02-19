import InventoryCreateWindmillForm from "../components/InventoryCreateWindmillForm";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/inventory-create-windmill.module.css";

function InventoryCreateWindmill() {
  return (
    <ProtectedRoute>
      <section className={Style.inventoryCreateWindmill}>
        <InventoryCreateWindmillForm />
      </section>
    </ProtectedRoute>
  );
}

export default InventoryCreateWindmill;
