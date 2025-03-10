import InventoryListDeleteTable from "../components/InventoryListDeleteTable";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/inventory-list.module.css";

function InventoryListDeleteReference() {
  return (
    <ProtectedRoute>
      <section className={Style.inventoryList}>
        <InventoryListDeleteTable
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

export default InventoryListDeleteReference;
