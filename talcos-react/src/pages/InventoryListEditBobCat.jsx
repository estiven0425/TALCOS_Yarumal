import InventoryListEditTable from "../components/InventoryListEditTable";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/inventory-list.module.css";

function InventoryListEditBobCat() {
  return (
    <ProtectedRoute>
      <section className={Style.inventoryList}>
        <InventoryListEditTable
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

export default InventoryListEditBobCat;
