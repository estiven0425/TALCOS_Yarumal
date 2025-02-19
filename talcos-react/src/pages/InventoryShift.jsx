import InventoryShiftButton from "../components/InventoryShiftButton";
import InventoryShiftList from "../components/InventoryShiftList";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/inventory-shift.module.css";

function InventoryShift() {
  return (
    <ProtectedRoute>
      <section className={Style.inventoryShift}>
        <InventoryShiftButton />
        <main className={Style.inventoryShiftMain}>
          <InventoryShiftList />
        </main>
      </section>
    </ProtectedRoute>
  );
}

export default InventoryShift;
