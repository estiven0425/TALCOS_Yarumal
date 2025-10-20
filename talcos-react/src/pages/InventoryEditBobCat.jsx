import InventoryEditForm from "../components/InventoryEditForm";
import ProtectedRoute from "../utils/ProtectedRoute";

import Style from "./styles/inventory-edit.module.css";

function InventoryEditBulk() {
  const fields = [
    {
      name: "nombre_bob_cat",
      label: "Nombre",
      placeholder: "Ingresa el nombre del bob - cat",
      type: "text",
    },
  ];

  return (
    <ProtectedRoute>
      <section className={Style.inventoryEdit}>
        <InventoryEditForm
          redirectPath="bobcat"
          fields={fields}
          dataId="id_bob_cat"
          endpoint="bob_cats"
          nameError="el bob - cat"
          nameConfirmation="Bob - cat editado"
          title="Complete los datos para editar el bob - cat"
          nameButton="bob - cat"
        />
      </section>
    </ProtectedRoute>
  );
}

export default InventoryEditBulk;
