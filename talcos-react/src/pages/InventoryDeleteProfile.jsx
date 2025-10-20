import InventoryDeleteConfirmation from "../components/InventoryDeleteConfirmation";
import ProtectedRoute from "../utils/ProtectedRoute";

import Style from "./styles/inventory-delete.module.css";

function InventoryDeleteProfile() {
  return (
    <ProtectedRoute>
      <section className={Style.inventoryDelete}>
        <InventoryDeleteConfirmation
          dataId="id_perfil"
          redirectPath="profile"
          endpoint="perfiles/eliminarperfil"
          name="actividad_perfil"
          nameError="el perfil"
          nameConfirmation="Perfil eliminado"
          title="¿Seguro que desea eliminar el perfil seleccionado?"
          nameButton="perfil"
        />
      </section>
    </ProtectedRoute>
  );
}

export default InventoryDeleteProfile;
