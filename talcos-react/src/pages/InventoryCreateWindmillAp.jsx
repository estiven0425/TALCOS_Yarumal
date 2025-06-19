import InventoryCreateForm from "../components/InventoryCreateForm";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/inventory-create.module.css";

function InventoryCreateWindmillAp() {
  const fields = [
    {
      name: "nombre_molino_ap",
      label: "Nombre",
      placeholder: "Ingresa el nombre del molino AP",
      type: "text",
      required: true,
      validationMessage: "El nombre del molino AP es obligatorio.",
    },
    {
      name: "horometro_molino_ap",
      label: "Horómetro",
      placeholder: "Ingresa el horómetro del molino AP",
      type: "number",
      required: true,
      validationMessage: "El horómetro del molino AP es obligatorio.",
    },
  ];

  return (
    <ProtectedRoute>
      <section className={Style.inventoryCreate}>
        <InventoryCreateForm
          redirectPath="windmillap"
          fields={fields}
          endpoint="molinos_ap"
          nameError="el molino AP"
          nameConfirmation="Molino AP creado"
          title="Complete los datos para crear un nuevo molino AP"
          nameButton="molino AP"
        />
      </section>
    </ProtectedRoute>
  );
}

export default InventoryCreateWindmillAp;
