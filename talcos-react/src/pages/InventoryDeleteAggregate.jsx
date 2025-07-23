import InventoryDeleteAggregateConfirmation from "../components/InventoryDeleteAggregateConfirmation";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/inventory-delete.module.css";

function InventoryAggregate() {
  return (
    <ProtectedRoute>
      <section className={Style.inventoryDelete}>
        <InventoryDeleteAggregateConfirmation />
      </section>
    </ProtectedRoute>
  );
}

export default InventoryAggregate;
