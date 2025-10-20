import InventoryCreateForm from "../components/InventoryCreateForm";
import ProtectedRoute from "../utils/ProtectedRoute";

import Style from "./styles/inventory-create.module.css";

function InventoryCreateProfile() {
  const fields = [
    {
      name: "nombre_perfil",
      label: "Nombre",
      placeholder: "Ingresa el nombre del perfil",
      type: "text",
      required: true,
      validationMessage: "El nombre del perfil es obligatorio.",
    },
  ];

  return (
    <ProtectedRoute>
      <section className={Style.inventoryCreate}>
        <InventoryCreateForm
          redirectPath="profile"
          fields={fields}
          endpoint="perfiles"
          nameError="el perfil"
          nameConfirmation="Perfil creado"
          title="Complete los datos para crear un nuevo perfil"
          nameButton="perfil"
        />
      </section>
    </ProtectedRoute>
  );
}

export default InventoryCreateProfile;
