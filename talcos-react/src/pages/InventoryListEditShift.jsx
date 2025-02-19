import InventorytListEditShiftTable from "../components/InventoryListEditShiftTable";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/inventory-list-edit-shift.module.css";

function InventoryListEditShift() {
  return (
    <ProtectedRoute>
      <section className={Style.inventorytListEditShift}>
        <InventorytListEditShiftTable />
      </section>
    </ProtectedRoute>
  );
}

export default InventoryListEditShift;
