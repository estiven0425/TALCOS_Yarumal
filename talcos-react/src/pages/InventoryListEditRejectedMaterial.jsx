import InventoryListEditTable from "../components/InventoryListEditTable";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/inventory-list-edit.module.css";

function InventoryListEditRejectedMaterial() {
  return (
    <ProtectedRoute>
      <section className={Style.inventorytListEdit}>
        <InventoryListEditTable
          endpoint="productos_rechazados"
          redirectPath="rejectedmaterial"
          title="un producto rechazado"
          head={["Nombre", "Cantidad", "Retención"]}
          index="id_producto_rechazado"
          body={[
            "nombre_producto_rechazado",
            "cantidad_producto_rechazado",
            "retencion_producto_rechazado",
          ]}
          optional={{ cantidad_producto_rechazado: "Tons" }}
          name="productos rechazados"
        />
      </section>
    </ProtectedRoute>
  );
}

export default InventoryListEditRejectedMaterial;
