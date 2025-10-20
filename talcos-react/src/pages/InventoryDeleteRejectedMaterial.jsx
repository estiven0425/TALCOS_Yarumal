import InventoryDeleteConfirmation from "../components/InventoryDeleteConfirmation";
import ProtectedRoute from "../utils/ProtectedRoute";

import Style from "./styles/inventory-delete.module.css";

function InventoryDeleteRejectedMaterial() {
  return (
    <ProtectedRoute>
      <section className={Style.inventoryDelete}>
        <InventoryDeleteConfirmation
          dataId="id_producto_rechazado"
          redirectPath="rejectedmaterial"
          endpoint="productos_rechazados/eliminarproductorechazado"
          name="actividad_producto_rechazado"
          nameError="el producto rechazado"
          nameConfirmation="Producto rechazado eliminado"
          title="¿Seguro que desea eliminar el producto rechazado seleccionado?"
          nameButton="producto rechazado"
        />
      </section>
    </ProtectedRoute>
  );
}

export default InventoryDeleteRejectedMaterial;
