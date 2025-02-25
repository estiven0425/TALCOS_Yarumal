import InventoryListDeleteRawMaterialTable from "../components/InventoryListDeleteRawMaterialTable";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/inventory-list-delete-raw-material.module.css";

function InventoryListDeleteRawMaterial() {
  return (
    <ProtectedRoute>
      <section className={Style.inventoryListDeleteRawMaterial}>
        <InventoryListDeleteRawMaterialTable />
      </section>
    </ProtectedRoute>
  );
}

export default InventoryListDeleteRawMaterial;
