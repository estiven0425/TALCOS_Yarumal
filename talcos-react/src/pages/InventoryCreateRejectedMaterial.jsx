import InventoryCreateForm from "../components/InventoryCreateForm";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/inventory-create.module.css";

function InventoryCreateRejectedMaterial() {
  const fields = [
    {
      name: "nombre_producto_rechazado",
      label: "Nombre",
      placeholder: "Ingresa el nombre del producto rechazado",
      type: "text",
      required: true,
      validationMessage: "El nombre del producto rechazado es obligatorio.",
    },
    {
      name: "cantidad_producto_rechazado",
      label: "Cantidad",
      placeholder: "Ingresa la cantidad del producto rechazado en Tons",
      type: "number",
      required: true,
      validationMessage: "La cantidad del producto rechazado es obligatoria.",
    },
    {
      name: "retencion_producto_rechazado",
      label: "Retención",
      placeholder: "Ingresa la retencion del producto rechazado",
      type: "number",
      required: true,
      validationMessage: "La retencion del producto rechazado es obligatoria.",
    },
  ];

  return (
    <ProtectedRoute>
      <section className={Style.inventoryCreate}>
        <InventoryCreateForm
          redirectPath="rejectedmaterial"
          fields={fields}
          endpoint="productos_rechazados"
          nameError="el producto rechazado"
          nameConfirmation="Producto rechazado creado"
          title="Complete los datos para crear un nuevo producto rechazado"
          nameButton="producto rechazado"
        />
      </section>
    </ProtectedRoute>
  );
}

export default InventoryCreateRejectedMaterial;
