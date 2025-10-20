import InventoryRawMaterialRegisterList from "../components/InventoryRawMaterialRegisterList";
import ProtectedRoute from "../utils/ProtectedRoute";

import Style from "./styles/inventory-raw-material-register.module.css";

function InventoryRawMaterialRegister() {
  return (
    <ProtectedRoute>
      <section className={Style.inventoryRawMaterialRegister}>
        <InventoryRawMaterialRegisterList />
      </section>
    </ProtectedRoute>
  );
}

export default InventoryRawMaterialRegister;
