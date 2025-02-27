import InventoryCreateForm from "../components/InventoryCreateForm";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/inventory-create.module.css";

function InventoryCreateBobCat() {
  const fields = [
    {
      name: "nombre_bob_cat",
      label: "Nombre",
      placeholder: "Ingresa el nombre del bob - cat",
      type: "text",
      required: true,
      validationMessage: "El nombre del bob - cat es obligatorio.",
    },
  ];

  return (
    <ProtectedRoute>
      <section className={Style.inventoryCreate}>
        <InventoryCreateForm
          redirectPath="bobcat"
          fields={fields}
          endpoint="bob_cats"
          nameError="el bob - cat"
          nameConfirmation="Bob - cat creado"
          title="Complete los datos para crear un nuevo bob - cat"
          nameButton="bob - cat"
        />
      </section>
    </ProtectedRoute>
  );
}

export default InventoryCreateBobCat;
