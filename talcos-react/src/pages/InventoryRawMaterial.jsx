import InventoryRawMaterialButton from "../components/InventoryRawMaterialButton";
import InventoryRawMaterialList from "../components/InventoryRawMaterialList";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/inventory-raw-material.module.css";

function InventoryRawMaterial() {
  return (
    <ProtectedRoute>
      <section className={Style.inventoryRawMaterial}>
        <InventoryRawMaterialButton />
        <main className={Style.inventoryRawMaterialMain}>
          <InventoryRawMaterialList />
        </main>
      </section>
    </ProtectedRoute>
  );
}

export default InventoryRawMaterial;
