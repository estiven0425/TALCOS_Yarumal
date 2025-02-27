import InventoryListDeleteTable from "../components/InventoryListDeleteTable";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/inventory-list-delete.module.css";

function InventoryListDeleteBobCat() {
  return (
    <ProtectedRoute>
      <section className={Style.inventoryListDelete}>
        <InventoryListDeleteTable
          endpoint="bob_cats"
          redirectPath="bobcat"
          title="un bob - cat"
          head={["Identificador", "Nombre"]}
          index="id_bob_cat"
          body={["id_bob_cat", "nombre_bob_cat"]}
          optional={{}}
          name="bob - cat"
        />
      </section>
    </ProtectedRoute>
  );
}

export default InventoryListDeleteBobCat;
