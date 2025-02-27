import InventoryListEditTable from "../components/InventoryListEditTable";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/inventory-list-edit.module.css";

function InventoryListEditProfile() {
  return (
    <ProtectedRoute>
      <section className={Style.inventorytListEdit}>
        <InventoryListEditTable
          endpoint="perfiles"
          redirectPath="profile"
          title="un perfil"
          head={["Nombre", "Usuarios"]}
          index="id_perfil"
          body={["nombre_perfil"]}
          optional={{}}
          name="perfiles"
        />
      </section>
    </ProtectedRoute>
  );
}

export default InventoryListEditProfile;
