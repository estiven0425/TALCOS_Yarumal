import InventoryAggregateList from "../components/InventoryAggregateList";
import ProtectedRoute from "../utils/ProtectedRoute";

import Style from "./styles/inventory-aggregate.module.css";

function InventoryAggregate() {
  return (
    <ProtectedRoute>
      <section className={Style.inventoryAggregate}>
        <InventoryAggregateList />
      </section>
    </ProtectedRoute>
  );
}

export default InventoryAggregate;
