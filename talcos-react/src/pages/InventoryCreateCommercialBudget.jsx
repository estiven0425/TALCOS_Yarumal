import InventoryCreateForm from "../components/InventoryCreateForm";
import ProtectedRoute from "../utils/ProtectedRoute";

import Style from "./styles/inventory-create.module.css";

function InventoryCreateCommercialBudget() {
  const fields = [
    {
      name: "fecha_presupuesto_comercial",
      label: "Fecha",
      placeholder: "Ingresa la fecha del presupuesto comercial",
      type: "number",
      required: true,
      validationMessage: "la fecha del presupuesto comercial es obligatoria.",
    },
    {
      name: "capacidad_presupuesto_comercial",
      label: "Capacidad",
      placeholder: "Ingresa la capacidad del presupuesto comercial en Tons",
      type: "number",
      required: true,
      validationMessage:
        "La capacidad del presupuesto comercial es obligatoria.",
    },
  ];

  return (
    <ProtectedRoute>
      <section className={Style.inventoryCreate}>
        <InventoryCreateForm
          redirectPath="commercialbudget"
          fields={fields}
          endpoint="presupuestos_comerciales"
          nameError="el presupuesto comercial"
          nameConfirmation="Presupuesto comercial creado"
          title="Complete los datos para crear un nuevo presupuesto comercial"
          nameButton="presupuesto comercial"
        />
      </section>
    </ProtectedRoute>
  );
}

export default InventoryCreateCommercialBudget;
