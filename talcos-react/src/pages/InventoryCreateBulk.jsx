import InventoryCreateForm from "../components/InventoryCreateForm";
import ProtectedRoute from "../utils/ProtectedRoute";

import Style from "./styles/inventory-create.module.css";

function InventoryCreateBulk() {
  const fields = [
    {
      name: "nombre_bulto",
      label: "Nombre",
      placeholder: "Ingresa el nombre del bulto",
      type: "text",
      required: true,
      validationMessage: "El nombre del bulto es obligatorio.",
    },
    {
      name: "capacidad_bulto",
      label: "Capacidad",
      placeholder: "Ingresa la capacidad del bulto en Kg",
      type: "number",
      required: true,
      validationMessage: "La capacidad del bulto es obligatoria.",
    },
  ];

  return (
    <ProtectedRoute>
      <section className={Style.inventoryCreate}>
        <InventoryCreateForm
          redirectPath="bulk"
          fields={fields}
          endpoint="bultos"
          nameError="el bulto"
          nameConfirmation="Bulto creado"
          title="Complete los datos para crear un nuevo bulto"
          nameButton="bulto"
        />
      </section>
    </ProtectedRoute>
  );
}

export default InventoryCreateBulk;
