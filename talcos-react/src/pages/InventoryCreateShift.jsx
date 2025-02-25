import InventoryCreateForm from "../components/InventoryCreateForm";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/inventory-create.module.css";

function InventoryCreateShift() {
  const fields = [
    {
      name: "nombre_turno",
      label: "Nombre",
      placeholder: "Ingresa el nombre del turno",
      type: "text",
      required: true,
      validationMessage: "El nombre del turno es obligatorio.",
    },
    {
      name: "inicio_turno",
      label: "Hora de inicio",
      type: "time",
      required: true,
      validationMessage: "La hora de inicio del turno es obligatoria.",
    },
    {
      name: "fin_turno",
      label: "Hora de finalización",
      type: "time",
      required: true,
      validationMessage: "La hora de finalización del turno es obligatoria.",
    },
  ];

  return (
    <ProtectedRoute>
      <section className={Style.inventoryCreate}>
        <InventoryCreateForm
          redirectPath="shift"
          fields={fields}
          endpoint="turnos"
          nameError="el turno"
          nameConfirmation="Turno creado"
          title="Complete los datos para crear un nuevo turno"
          nameButton="turno"
        />
      </section>
    </ProtectedRoute>
  );
}

export default InventoryCreateShift;
