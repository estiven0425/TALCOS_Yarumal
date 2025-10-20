import InventoryListEditTable from "../components/InventoryListEditTable";
import ProtectedRoute from "../utils/ProtectedRoute";

import Style from "./styles/inventory-list.module.css";

function InventoryListEditReference() {
  return (
    <ProtectedRoute>
      <section className={Style.inventoryList}>
        <InventoryListEditTable
          endpoint="referencias"
          redirectPath="reference"
          title="una referencia"
          head={["Nombre", "Cantidad", "Cliente"]}
          index="id_referencia"
          body={[
            "nombre_referencia",
            "cantidad_referencia",
            "cliente_referencia",
          ]}
          optional={{ cantidad_referencia: "Tons" }}
          name="referencias"
        />
      </section>
    </ProtectedRoute>
  );
}

export default InventoryListEditReference;
