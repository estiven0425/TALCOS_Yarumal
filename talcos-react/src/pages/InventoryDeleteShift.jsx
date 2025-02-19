import InventoryDeleteShiftConfirmation from "../components/InventoryDeleteShiftConfirmation";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/inventory-delete-shift.module.css";

function InventoryDeleteShift() {
  return (
    <ProtectedRoute>
      <section className={Style.inventoryDeleteShift}>
        <InventoryDeleteShiftConfirmation />
      </section>
    </ProtectedRoute>
  );
}

export default InventoryDeleteShift;
