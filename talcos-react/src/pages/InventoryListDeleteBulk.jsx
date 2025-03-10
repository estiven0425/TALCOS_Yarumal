import InventoryListDeleteTable from "../components/InventoryListDeleteTable";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/inventory-list.module.css";

function InventoryListDeleteBulk() {
  return (
    <ProtectedRoute>
      <section className={Style.inventoryList}>
        <InventoryListDeleteTable
          endpoint="bultos"
          redirectPath="bulk"
          title="un bulto"
          head={["Nombre", "Capacidad"]}
          index="id_bulto"
          body={["nombre_bulto", "capacidad_bulto"]}
          optional={{ capacidad_bulto: "Kg" }}
          name="bultos"
        />
      </section>
    </ProtectedRoute>
  );
}

export default InventoryListDeleteBulk;
