import InventoryCreateRawMaterialRegisterForm from "../components/InventoryCreateRawMaterialRegisterForm";
import ProtectedRoute from "../utils/ProtectedRoute";

import Style from "./styles/inventory-create.module.css";

function InventoryCreateRawMaterialRegister() {
  return (
    <ProtectedRoute>
      <section className={Style.inventoryCreate}>
        <InventoryCreateRawMaterialRegisterForm />
      </section>
    </ProtectedRoute>
  );
}

export default InventoryCreateRawMaterialRegister;
