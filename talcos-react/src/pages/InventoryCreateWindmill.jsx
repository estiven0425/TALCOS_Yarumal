import InventoryCreateForm from "../components/InventoryCreateForm";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/inventory-create.module.css";

function InventoryCreateWindmill() {
  const fields = [
    {
      name: "nombre_molino",
      label: "Nombre",
      placeholder: "Ingresa el nombre del molino",
      type: "text",
      required: true,
      validationMessage: "El nombre del molino es obligatorio.",
    },
    {
      name: "horometro_molino",
      label: "Horómetro",
      placeholder: "Ingresa el horómetro del molino",
      type: "number",
      required: true,
      validationMessage: "El horómetro del molino es obligatorio.",
    },
  ];

  return (
    <ProtectedRoute>
      <section className={Style.inventoryCreate}>
        <InventoryCreateForm
          redirectPath="windmill"
          fields={fields}
          endpoint="molinos"
          nameError="el molino"
          nameConfirmation="Molino creado"
          title="Complete los datos para crear un nuevo molino"
          nameButton="molino"
        />
      </section>
    </ProtectedRoute>
  );
}

export default InventoryCreateWindmill;
