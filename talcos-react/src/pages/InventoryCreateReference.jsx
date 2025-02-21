import InventoryCreateReferenceForm from "../components/InventoryCreateReferenceForm";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/inventory-create-reference.module.css";

function InventoryCreateReference() {
  return (
    <ProtectedRoute>
      <section className={Style.inventoryCreateReference}>
        <InventoryCreateReferenceForm />
      </section>
    </ProtectedRoute>
  );
}

export default InventoryCreateReference;
