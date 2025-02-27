import InventoryListDeleteTable from "../components/InventoryListDeleteTable";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/inventory-list-delete.module.css";

function InventoryListDeleteProfile() {
  return (
    <ProtectedRoute>
      <section className={Style.inventoryListDelete}>
        <InventoryListDeleteTable
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

export default InventoryListDeleteProfile;
