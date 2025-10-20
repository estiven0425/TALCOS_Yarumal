import InventoryButton from "../components/InventoryButton";
import InventoryList from "../components/InventoryList";
import ProtectedRoute from "../utils/ProtectedRoute";

import Style from "./styles/inventory-general.module.css";

function InventoryCommercialDispatche() {
  return (
    <ProtectedRoute>
      <section className={Style.inventory}>
        <InventoryButton
          location="commercialdispatche"
          name="despacho programado"
        />
        <main className={Style.inventoryMain}>
          <InventoryList
            location="despachos_comerciales"
            head={["Fecha", "Cantidad"]}
            index="id_despacho_comercial"
            body={["fecha_despacho_comercial", "cantidad_despacho_comercial"]}
            optional={{}}
            name="despachos programados"
          />
        </main>
      </section>
    </ProtectedRoute>
  );
}

export default InventoryCommercialDispatche;
