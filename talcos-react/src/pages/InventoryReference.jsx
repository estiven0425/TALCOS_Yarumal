import InventoryReferenceButton from "../components/InventoryReferenceButton";
import InventoryReferenceList from "../components/InventoryReferenceList";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/inventory-reference.module.css";

function InventoryReference() {
  return (
    <ProtectedRoute>
      <section className={Style.inventoryReference}>
        <InventoryReferenceButton />
        <main className={Style.inventoryReferenceMain}>
          <InventoryReferenceList />
        </main>
      </section>
    </ProtectedRoute>
  );
}

export default InventoryReference;
