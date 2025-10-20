import InventoryEditForm from "../components/InventoryEditForm";
import ProtectedRoute from "../utils/ProtectedRoute";

import Style from "./styles/inventory-edit.module.css";

function InventoryEditReference() {
  const fields = [
    {
      name: "nombre_referencia",
      label: "Nombre",
      placeholder: "Ingresa el nombre de la referencia",
      type: "text",
    },
    {
      name: "cantidad_referencia",
      label: "Cantidad",
      placeholder: "Ingresa la cantidad de la referencia",
      type: "number",
    },
    {
      name: "cliente_referencia",
      label: "Cliente",
      placeholder: "Ingresa el cliente de la referencia",
      type: "text",
    },
  ];

  return (
    <ProtectedRoute>
      <section className={Style.inventoryEdit}>
        <InventoryEditForm
          redirectPath="reference"
          fields={fields}
          dataId="id_referencia"
          endpoint="referencias"
          nameError="la referencia"
          nameConfirmation="Referencia editada"
          title="Complete los datos para editar la referencia"
          nameButton="referencia"
        />
      </section>
    </ProtectedRoute>
  );
}

export default InventoryEditReference;
