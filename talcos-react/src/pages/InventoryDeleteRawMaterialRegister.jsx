import InventoryDeleteRawMaterialRegisterConfirmation from "../components/InventoryDeleteRawMaterialRegisterConfirmation";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/inventory-delete.module.css";

function InventoryDeleteRawMaterialRegister() {
  return (
    <ProtectedRoute>
      <section className={Style.inventoryDelete}>
        <InventoryDeleteRawMaterialRegisterConfirmation />
      </section>
    </ProtectedRoute>
  );
}

export default InventoryDeleteRawMaterialRegister;
