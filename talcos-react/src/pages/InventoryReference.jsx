import InventoryButton from "../components/InventoryButton";
import InventoryList from "../components/InventoryList";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/inventory-general.module.css";

function InventoryReference() {
  return (
    <ProtectedRoute>
      <section className={Style.inventory}>
        <InventoryButton location="reference" name="referencia" />
        <main className={Style.inventoryMain}>
          <InventoryList
            location="referencias"
            head={["Nombre", "Cantidad", "Cliente"]}
            index="id_referencia"
            body={[
              "nombre_referencia",
              "cantidad_referencia",
              "cliente_referencia",
            ]}
            optional={{ cantidad_referencia: "Tons" }}
            name="referencias"
          />
        </main>
      </section>
    </ProtectedRoute>
  );
}

export default InventoryReference;
