import InventoryEditForm from "../components/InventoryEditForm";
import ProtectedRoute from "../utils/ProtectedRoute";

import Style from "./styles/inventory-edit.module.css";

function InventoryEditWindmillAp() {
  const fields = [
    {
      name: "nombre_molino_ap",
      label: "Nombre",
      placeholder: "Ingresa el nombre del molino AP",
      type: "text",
    },
    {
      name: "horometro_molino_ap",
      label: "Horómetro",
      placeholder: "Ingresa el horómetro del molino AP",
      type: "number",
    },
  ];

  return (
    <ProtectedRoute>
      <section className={Style.inventoryEdit}>
        <InventoryEditForm
          redirectPath="windmillap"
          fields={fields}
          dataId="id_molino_ap"
          endpoint="molinos_ap"
          nameError="el molino AP"
          nameConfirmation="Molino AP editado"
          title="Complete los datos para editar el molino AP"
          nameButton="molino AP"
        />
      </section>
    </ProtectedRoute>
  );
}

export default InventoryEditWindmillAp;
