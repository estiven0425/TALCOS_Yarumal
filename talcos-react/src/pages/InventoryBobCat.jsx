import InventoryButton from "../components/InventoryButton";
import InventoryList from "../components/InventoryList";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/inventory-general.module.css";

function InventoryBobCat() {
  return (
    <ProtectedRoute>
      <section className={Style.inventory}>
        <InventoryButton location="bobcat" name="bob - cat" />
        <main className={Style.inventoryMain}>
          <InventoryList
            location="bob_cats"
            head={["Identificador", "Nombre"]}
            index="id_bob_cat"
            body={["id_bob_cat", "nombre_bob_cat"]}
            optional={{}}
            name="bob - cats"
          />
        </main>
      </section>
    </ProtectedRoute>
  );
}

export default InventoryBobCat;
