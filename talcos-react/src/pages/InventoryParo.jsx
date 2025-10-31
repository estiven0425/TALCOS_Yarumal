import InventoryButton from "../components/InventoryButton";
import InventoryList from "../components/InventoryList";
import ProtectedRoute from "../utils/ProtectedRoute";

import Style from "./styles/inventory-general.module.css";

function InventoryParo() {
  return (
    <ProtectedRoute>
      <section className={Style.inventory}>
        <InventoryButton location="paro" name="tipo de paro" />
        <main className={Style.inventoryMain}>
          <InventoryList
            location="paros"
            head={["Identificador", "Nombre"]}
            index="id_paro"
            body={["id_paro", "nombre_paro"]}
            optional={{}}
            name="paros"
          />
        </main>
      </section>
    </ProtectedRoute>
  );
}

export default InventoryParo;
