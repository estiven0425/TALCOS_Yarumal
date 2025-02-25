import InventoryListEditTable from "../components/InventoryListEditTable";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/inventory-list-edit.module.css";

function InventoryListEditBulk() {
  return (
    <ProtectedRoute>
      <section className={Style.inventorytListEdit}>
        <InventoryListEditTable
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

export default InventoryListEditBulk;
