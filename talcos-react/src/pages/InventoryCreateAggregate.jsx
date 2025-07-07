import InventoryCreateAggregateForm from "../components/InventoryCreateAggregateForm";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/inventory-create.module.css";

function InventoryCreateAggregate() {
    return (
        <ProtectedRoute>
            <section className={Style.inventoryCreate}>
                <InventoryCreateAggregateForm />
            </section>
        </ProtectedRoute>
    );
}

export default InventoryCreateAggregate;
