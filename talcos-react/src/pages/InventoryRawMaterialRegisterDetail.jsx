import InventoryRawMaterialRegisterListDetail from "../components/InventoryRawMaterialRegisterListDetail";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/inventory-raw-material-register.module.css";

function InventoryRawMaterialRegisterDetail() {
  return (
    <ProtectedRoute>
      <section className={Style.inventoryRawMaterialRegister}>
        <InventoryRawMaterialRegisterListDetail />
      </section>
    </ProtectedRoute>
  );
}

export default InventoryRawMaterialRegisterDetail;
