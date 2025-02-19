import InventoryList from "../components/InventoryList";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/inventory.module.css";

function Inventory() {
  return (
    <ProtectedRoute>
      <section className={Style.inventory}>
        <InventoryList />
      </section>
    </ProtectedRoute>
  );
}

export default Inventory;
