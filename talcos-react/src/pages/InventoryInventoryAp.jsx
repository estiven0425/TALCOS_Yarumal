import InventoryButton from "../components/InventoryButton";
import InventoryListInventoryAp from "../components/InventoryListInventoryAp";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/inventory-general.module.css";

function InventoryInventoryAp() {
  return (
    <ProtectedRoute>
      <section className={Style.inventory}>
        <InventoryButton location="inventoryap" name="Inventario AP" />
        <main className={Style.inventoryMain}>
          <InventoryListInventoryAp />
        </main>
      </section>
    </ProtectedRoute>
  );
}

export default InventoryInventoryAp;
