import InventoryEditShiftForm from "../components/InventoryEditShiftForm";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/inventory-edit-shift.module.css";

function InventoryEditShift() {
  return (
    <ProtectedRoute>
      <section className={Style.inventoryEditShift}>
        <InventoryEditShiftForm />
      </section>
    </ProtectedRoute>
  );
}

export default InventoryEditShift;
