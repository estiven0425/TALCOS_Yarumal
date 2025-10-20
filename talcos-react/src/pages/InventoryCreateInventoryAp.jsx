import InventoryCreateForm from "../components/InventoryCreateForm";
import ProtectedRoute from "../utils/ProtectedRoute";

import Style from "./styles/inventory-create.module.css";

function InventoryCreateInventoryAp() {
  const fields = [
    {
      name: "tipo_inventario_ap",
      label: "Tipo",
      placeholder: "Ingresa el tipo de inventario AP",
      type: "text",
      required: true,
      validationMessage: "El tipo del inventario AP es obligatorio.",
    },
    {
      name: "nombre_inventario_ap",
      label: "Nombre",
      placeholder: "Ingresa el nombre del inventario AP",
      type: "text",
      required: true,
      validationMessage: "El nombre del inventario AP es obligatorio.",
    },
    {
      name: "porcentaje_inventario_ap",
      label: "Porcentaje",
      placeholder: "Ingresa el porcentaje del inventario AP",
      type: "number",
      required: true,
      validationMessage: "El porcentaje del inventario AP es obligatorio.",
    },
    {
      name: "total_inventario_ap",
      label: "Total",
      placeholder: "Ingresa el total del inventario AP en kilogramos",
      type: "number",
      required: true,
      validationMessage: "El total del inventario AP es obligatorio.",
    },
  ];

  return (
    <ProtectedRoute>
      <section className={Style.inventoryCreate}>
        <InventoryCreateForm
          redirectPath="ap"
          fields={fields}
          endpoint="inventario_ap"
          nameError="el inventario AP"
          nameConfirmation="Inventario AP creado"
          title="Complete los datos para crear un nuevo inventario AP"
          nameButton="inventario AP"
        />
      </section>
    </ProtectedRoute>
  );
}

export default InventoryCreateInventoryAp;
