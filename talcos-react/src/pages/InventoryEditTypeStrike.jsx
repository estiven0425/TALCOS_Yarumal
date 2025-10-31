import InventoryEditForm from "../components/InventoryEditForm";
import ProtectedRoute from "../utils/ProtectedRoute";

import Style from "./styles/inventory-edit.module.css";

function InventoryEditTypeStrike() {
  const fields = [
    {
      name: "nombre_paro",
      label: "Nombre",
      placeholder: "Ingresa el nombre del tipo de paro",
      type: "text",
    },
  ];

  return (
    <ProtectedRoute>
      <section className={Style.inventoryEdit}>
        <InventoryEditForm
          redirectPath="paro"
          fields={fields}
          dataId="id_paro"
          endpoint="paros"
          nameError="el tipo de paro"
          nameConfirmation="Tipo de paro editado"
          title="Complete los datos para editar el tipo de paro"
          nameButton="tipo de paro"
        />
      </section>
    </ProtectedRoute>
  );
}

export default InventoryEditTypeStrike;
