import InventoryEditForm from "../components/InventoryEditForm";
import ProtectedRoute from "../utils/ProtectedRoute";

import Style from "./styles/inventory-edit.module.css";

function InventoryEditCommercialBudget() {
  const fields = [
    {
      name: "fecha_presupuesto_comercial",
      label: "Fecha",
      placeholder: "Ingresa la fecha del presupuesto comercial",
      type: "number",
    },
    {
      name: "capacidad_presupuesto_comercial",
      label: "Capacidad",
      placeholder: "Ingresa la capacidad del presupuesto comercial en Tons",
      type: "number",
    },
  ];

  return (
    <ProtectedRoute>
      <section className={Style.inventoryEdit}>
        <InventoryEditForm
          redirectPath="commercialbudget"
          fields={fields}
          dataId="id_presupuesto_comercial"
          endpoint="presupuestos_comerciales"
          nameError="el presupuesto comercial"
          nameConfirmation="Presupuesto comercial editado"
          title="Complete los datos para editar el presupuesto comercial"
          nameButton="presupuesto comercial"
        />
      </section>
    </ProtectedRoute>
  );
}

export default InventoryEditCommercialBudget;
