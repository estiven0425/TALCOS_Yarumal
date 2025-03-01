import InventoryListDeleteTable from "../components/InventoryListDeleteTable";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/inventory-list-delete.module.css";

function InventoryListDeleteProfile() {
  return (
    <ProtectedRoute>
      <section className={Style.inventoryListDelete}>
        <InventoryListDeleteTable
          endpoint="perfiles/conteoperfil"
          redirectPath="profile"
          title="un perfil"
          head={["Nombre", "Cantidad de usuarios"]}
          index="id_perfil"
          body={["nombre_perfil", "cantidad_usuarios"]}
          optional={{}}
          name="perfiles"
        />
      </section>
    </ProtectedRoute>
  );
}

export default InventoryListDeleteProfile;
