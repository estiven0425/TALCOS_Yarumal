import InventorytListEditReferenceTable from "../components/InventoryListEditReferenceTable";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/inventory-list-edit-reference.module.css";

function InventoryListEditReference() {
  return (
    <ProtectedRoute>
      <section className={Style.inventorytListEditReference}>
        <InventorytListEditReferenceTable />
      </section>
    </ProtectedRoute>
  );
}

export default InventoryListEditReference;
