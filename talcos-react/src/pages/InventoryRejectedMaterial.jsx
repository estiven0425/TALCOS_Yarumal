import InventoryList from "../components/InventoryList";
import InventoryRejectedMaterialButton from "../components/InventoryRejectedMaterialButton";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/inventory-general.module.css";

function InventoryRejectedMaterial() {
  return (
    <ProtectedRoute>
      <section className={Style.inventory}>
        <InventoryRejectedMaterialButton />
        <main className={Style.inventoryMain}>
          <InventoryList
            location="productos_rechazados"
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
        </main>
      </section>
    </ProtectedRoute>
  );
}

export default InventoryRejectedMaterial;
