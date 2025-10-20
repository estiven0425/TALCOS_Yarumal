import InventoryEditForm from "../components/InventoryEditForm";
import ProtectedRoute from "../utils/ProtectedRoute";

import Style from "./styles/inventory-edit.module.css";

function InventoryEditRejectedMaterial() {
  const fields = [
    {
      name: "nombre_producto_rechazado",
      label: "Nombre",
      placeholder: "Ingresa el nombre del producto rechazado",
      type: "text",
    },
    {
      name: "cantidad_producto_rechazado",
      label: "Cantidad",
      placeholder: "Ingresa la cantidad del producto rechazado en Tons",
      type: "text",
    },
    {
      name: "retencion_producto_rechazado",
      label: "Retención",
      placeholder: "Ingresa la retención del producto rechazado",
      type: "text",
    },
  ];

  return (
    <ProtectedRoute>
      <section className={Style.inventoryEdit}>
        <InventoryEditForm
          redirectPath="rejectedmaterial"
          fields={fields}
          dataId="id_producto_rechazado"
          endpoint="productos_rechazados"
          nameError="el producto rechazado"
          nameConfirmation="Producto rechazado editado"
          title="Complete los datos para editar el producto rechazado"
          nameButton="producto rechazado"
        />
      </section>
    </ProtectedRoute>
  );
}

export default InventoryEditRejectedMaterial;
