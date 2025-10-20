import InventoryButton from "../components/InventoryButton";
import InventoryList from "../components/InventoryList";
import ProtectedRoute from "../utils/ProtectedRoute";

import Style from "./styles/inventory-general.module.css";

function InventoryCommercialBudget() {
  return (
    <ProtectedRoute>
      <section className={Style.inventory}>
        <InventoryButton location="dispatche" name="despacho" />
        <main className={Style.inventoryMain}>
          <InventoryList
            location="despachos"
            head={["Fecha", "Cantidad"]}
            index="id_despacho"
            body={["fecha_despacho", "cantidad_despacho"]}
            optional={{}}
            name="despachos"
          />
        </main>
      </section>
    </ProtectedRoute>
  );
}

export default InventoryCommercialBudget;
