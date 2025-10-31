import InventoryCreateForm from "../components/InventoryCreateForm";
import ProtectedRoute from "../utils/ProtectedRoute";

import Style from "./styles/inventory-create.module.css";

function InventoryCreateTypeStrike() {
  const fields = [
    {
      name: "nombre_paro",
      label: "Nombre",
      placeholder: "Ingresa el nombre del tipo de paro",
      type: "text",
      required: true,
      validationMessage: "El nombre del tipo de paro es obligatorio.",
    },
  ];

  return (
    <ProtectedRoute>
      <section className={Style.inventoryCreate}>
        <InventoryCreateForm
          redirectPath="paro"
          fields={fields}
          endpoint="paros"
          nameError="el tipo de paro"
          nameConfirmation="Tipo de paro creado"
          title="Complete los datos para crear un nuevo tipo de paro"
          nameButton="tipo de paro"
        />
      </section>
    </ProtectedRoute>
  );
}

export default InventoryCreateTypeStrike;
