import InventoryListEditTable from "../components/InventoryListEditTable";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/inventory-list.module.css";

function InventoryListEditCommercialDispatche() {
  return (
    <ProtectedRoute>
      <section className={Style.inventoryList}>
        <InventoryListEditTable
          endpoint="despachos_comerciales"
          redirectPath="commercialdispatche"
          title="un despacho programado"
          head={["Fecha", "Cantidad"]}
          index="id_despacho_comercial"
          body={["fecha_despacho_comercial", "cantidad_despacho_comercial"]}
          optional={{}}
          name="despachos programados"
        />
      </section>
    </ProtectedRoute>
  );
}

export default InventoryListEditCommercialDispatche;
