import InventoryButton from "../components/InventoryButton";
import InventoryList from "../components/InventoryList";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/inventory-general.module.css";

function InventoryProfile() {
  return (
    <ProtectedRoute>
      <section className={Style.inventory}>
        <InventoryButton location="profile" name="perfil" />
        <main className={Style.inventoryMain}>
          <InventoryList
            location="perfiles/conteoperfil"
            head={["Nombre", "Cantidad de usuarios"]}
            index="id_perfil"
            body={["nombre_perfil", "cantidad_usuarios"]}
            optional={{}}
            name="perfiles"
          />
        </main>
      </section>
    </ProtectedRoute>
  );
}

export default InventoryProfile;
