import InventoryCreateForm from "../components/InventoryCreateForm";
import ProtectedRoute from "../utils/ProtectedRoute";

import Style from "./styles/inventory-create.module.css";

function InventoryCreateDispatche() {
  const fields = [
    {
      name: "fecha_despacho",
      label: "Fecha",
      placeholder: "Ingresa la fecha del despacho",
      type: "date",
      required: true,
      validationMessage: "la fecha del despacho es obligatoria.",
    },
    {
      name: "cantidad_despacho",
      label: "Cantidad",
      placeholder: "Ingresa la cantidad del despacho en Tons",
      type: "number",
      required: true,
      validationMessage: "La cantidad del despacho es obligatoria.",
    },
  ];

  return (
    <ProtectedRoute>
      <section className={Style.inventoryCreate}>
        <InventoryCreateForm
          redirectPath="dispatche"
          fields={fields}
          endpoint="despachos"
          nameError="el despacho"
          nameConfirmation="Despacho creado"
          title="Complete los datos para crear un nuevo despacho"
          nameButton="despacho"
        />
      </section>
    </ProtectedRoute>
  );
}

export default InventoryCreateDispatche;
