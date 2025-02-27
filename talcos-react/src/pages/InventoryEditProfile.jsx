import InventoryEditForm from "../components/InventoryEditForm";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/inventory-edit.module.css";

function InventoryEditProfile() {
  const fields = [
    {
      name: "nombre_perfil",
      label: "Nombre",
      placeholder: "Ingresa el nombre del perfil",
      type: "text",
    },
  ];

  return (
    <ProtectedRoute>
      <section className={Style.inventoryEdit}>
        <InventoryEditForm
          redirectPath="profile"
          fields={fields}
          dataId="id_perfil"
          endpoint="perfiles"
          nameError="el perfil"
          nameConfirmation="Perfil editado"
          title="Complete los datos para editar el perfil"
          nameButton="perfil"
        />
      </section>
    </ProtectedRoute>
  );
}

export default InventoryEditProfile;
