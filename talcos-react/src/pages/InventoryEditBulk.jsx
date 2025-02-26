import InventoryEditForm from "../components/InventoryEditForm";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/inventory-edit.module.css";

function InventoryEditBulk() {
  const fields = [
    {
      name: "nombre_bulto",
      label: "Nombre",
      placeholder: "Ingresa el nombre del bulto",
      type: "text",
    },
    {
      name: "capacidad_bulto",
      label: "Capacidad",
      placeholder: "Ingresa la capacidad del bulto",
      type: "number",
    },
  ];

  return (
    <ProtectedRoute>
      <section className={Style.inventoryEdit}>
        <InventoryEditForm
          redirectPath="bulk"
          fields={fields}
          dataId="id_bulto"
          endpoint="bultos"
          nameError="el bulto"
          nameConfirmation="Bulto editado"
          title="Complete los datos para editar el bulto"
          nameButton="bulto"
        />
      </section>
    </ProtectedRoute>
  );
}

export default InventoryEditBulk;
