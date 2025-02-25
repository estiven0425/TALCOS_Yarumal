import InventoryButton from "../components/InventoryButton";
import InventoryList from "../components/InventoryList";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/inventory-general.module.css";

function InventoryWindmill() {
  return (
    <ProtectedRoute>
      <section className={Style.inventory}>
        <InventoryButton location="windmill" name="molino" />
        <main className={Style.inventoryMain}>
          <InventoryList
            location="molinos"
            head={["Nombre", "Horómetro"]}
            index="id_molino"
            body={["nombre_molino", "horometro_molino"]}
            optional={{ horometro_molino: "Hrs" }}
            name="molinos"
          />
        </main>
      </section>
    </ProtectedRoute>
  );
}

export default InventoryWindmill;
