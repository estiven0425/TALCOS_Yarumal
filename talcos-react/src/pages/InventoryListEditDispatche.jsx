import InventoryListEditTable from "../components/InventoryListEditTable";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/inventory-list.module.css";

function InventoryListEditDispatche() {
  return (
    <ProtectedRoute>
      <section className={Style.inventoryList}>
        <InventoryListEditTable
          endpoint="despachos"
          redirectPath="dispatche"
          title="un despacho"
          head={["Fecha", "Cantidad"]}
          index="id_despacho"
          body={["fecha_despacho", "cantidad_despacho"]}
          optional={{}}
          name="despachos"
        />
      </section>
    </ProtectedRoute>
  );
}

export default InventoryListEditDispatche;
