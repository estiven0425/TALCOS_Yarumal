import InventoryCreateForm from "../components/InventoryCreateForm";
import ProtectedRoute from "../utils/ProtectedRoute";

import Style from "./styles/inventory-create.module.css";

function InventoryCreateRawMaterial() {
  const fields = [
    {
      name: "nombre_materia_prima",
      label: "Nombre",
      placeholder: "Ingresa el nombre de la materia prima",
      type: "text",
      required: true,
      validationMessage: "El nombre de la materia prima es obligatorio.",
    },
    {
      name: "cantidad_materia_prima",
      label: "Cantidad",
      placeholder: "Ingresa la cantidad de la materia prima en Tons",
      type: "number",
      required: true,
      validationMessage: "La cantidad de la materia prima es obligatoria.",
    },
  ];

  return (
    <ProtectedRoute>
      <section className={Style.inventoryCreate}>
        <InventoryCreateForm
          redirectPath="rawmaterial"
          fields={fields}
          endpoint="materias_primas"
          nameError="la materia prima"
          nameConfirmation="Materia prima creada"
          title="Complete los datos para crear una nueva materia prima"
          nameButton="materia prima"
        />
      </section>
    </ProtectedRoute>
  );
}

export default InventoryCreateRawMaterial;
