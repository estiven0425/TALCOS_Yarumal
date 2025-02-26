import InventoryEditForm from "../components/InventoryEditForm";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/inventory-edit.module.css";

function InventoryEditWindmill() {
  const fields = [
    {
      name: "nombre_molino",
      label: "Nombre",
      placeholder: "Ingresa el nombre del molino",
      type: "text",
    },
    {
      name: "horometro_molino",
      label: "Horómetro",
      placeholder: "Ingresa el horómetro del molino",
      type: "number",
    },
  ];

  return (
    <ProtectedRoute>
      <section className={Style.inventoryEdit}>
        <InventoryEditForm
          redirectPath="windmill"
          fields={fields}
          dataId="id_molino"
          endpoint="molinos"
          nameError="el molino"
          nameConfirmation="Molino editado"
          title="Complete los datos para editar el molino"
          nameButton="molino"
        />
      </section>
    </ProtectedRoute>
  );
}

export default InventoryEditWindmill;
