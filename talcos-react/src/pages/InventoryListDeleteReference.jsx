import InventoryListDeleteReferenceTable from "../components/InventoryListDeleteReferenceTable";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/inventory-list-delete-reference.module.css";

function InventoryListDeleteReference() {
  return (
    <ProtectedRoute>
      <section className={Style.inventoryListDeleteReference}>
        <InventoryListDeleteReferenceTable />
      </section>
    </ProtectedRoute>
  );
}

export default InventoryListDeleteReference;
