import InventoryButton from "../components/InventoryButton";
import InventoryList from "../components/InventoryList";
import ProtectedRoute from "../utils/ProtectedRoute";

import Style from "./styles/inventory-general.module.css";

function InventoryBulk() {
  return (
    <ProtectedRoute>
      <section className={Style.inventory}>
        <InventoryButton location="bulk" name="bulto" />
        <main className={Style.inventoryMain}>
          <InventoryList
            location="bultos"
            head={["Nombre", "Capacidad"]}
            index="id_bulto"
            body={["nombre_bulto", "capacidad_bulto"]}
            optional={{ capacidad_bulto: "Kg" }}
            name="bultos"
          />
        </main>
      </section>
    </ProtectedRoute>
  );
}

export default InventoryBulk;
