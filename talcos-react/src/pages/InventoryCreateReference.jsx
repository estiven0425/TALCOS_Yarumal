import InventoryCreateForm from "../components/InventoryCreateForm";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/inventory-create.module.css";

function InventoryCreateReference() {
  const fields = [
    {
      name: "nombre_referencia",
      label: "Nombre",
      placeholder: "Ingresa el nombre de la referencia",
      type: "text",
      required: true,
      validationMessage: "El nombre de la referencia es obligatorio.",
    },
    {
      name: "cantidad_referencia",
      label: "Cantidad",
      placeholder: "Ingresa la cantidad de la referencia en Tons",
      type: "number",
      required: true,
      validationMessage: "La cantidad de la referencia es obligatoria.",
    },
    {
      name: "cliente_referencia",
      label: "Cliente",
      placeholder: "Ingresa el cliente de la referencia",
      type: "text",
      required: false,
      validationMessage: "El cliente de la referencia es obligatorio.",
    },
  ];

  return (
    <ProtectedRoute>
      <section className={Style.inventoryCreate}>
        <InventoryCreateForm
          redirectPath="reference"
          fields={fields}
          endpoint="referencias"
          nameError="la referencia"
          nameConfirmation="Referencia creada"
          title="Complete los datos para crear una nueva referencia"
          nameButton="referencia"
        />
      </section>
    </ProtectedRoute>
  );
}

export default InventoryCreateReference;
