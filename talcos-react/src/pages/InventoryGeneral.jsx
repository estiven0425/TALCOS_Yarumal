import InventoryListProfile from "../components/InventoryListProfile";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/inventory.module.css";

function InventoryGeneral() {
  return (
    <ProtectedRoute>
      <section className={Style.inventory}>
        <InventoryListProfile />
      </section>
    </ProtectedRoute>
  );
}

export default InventoryGeneral;
