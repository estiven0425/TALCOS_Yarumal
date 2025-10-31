import InventoryListEditTable from "../components/InventoryListEditTable";
import ProtectedRoute from "../utils/ProtectedRoute";

import Style from "./styles/inventory-list.module.css";

function InventoryListEditTypeStrike() {
  return (
    <ProtectedRoute>
      <section className={Style.inventoryList}>
        <InventoryListEditTable
          endpoint="paros"
          redirectPath="paro"
          title="un tipo de paro"
          head={["Identificador", "Nombre"]}
          index="id_paro"
          body={["id_paro", "nombre_paro"]}
          optional={{}}
          name="tipo de paro"
        />
      </section>
    </ProtectedRoute>
  );
}

export default InventoryListEditTypeStrike;
