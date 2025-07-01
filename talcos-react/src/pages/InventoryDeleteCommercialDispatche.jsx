import InventoryDeleteConfirmation from "../components/InventoryDeleteConfirmation";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/inventory-delete.module.css";

function InventoryDeleteCommercialDispatche() {
  return (
    <ProtectedRoute>
      <section className={Style.inventoryDelete}>
        <InventoryDeleteConfirmation
          dataId="id_despacho_comercial"
          redirectPath="commercialdispatche"
          endpoint="despachos_comerciales/eliminardespachocomercial"
          name="actividad_despacho_comercial"
          nameError="el despacho programado"
          nameConfirmation="Despacho programado eliminado"
          title="¿Seguro que desea eliminar el despacho programado seleccionado?"
          nameButton="despacho programado"
        />
      </section>
    </ProtectedRoute>
  );
}

export default InventoryDeleteCommercialDispatche;
