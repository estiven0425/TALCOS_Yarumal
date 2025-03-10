import InventoryListDeleteTable from "../components/InventoryListDeleteTable";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/inventory-list.module.css";

function InventoryListDeleteWindmill() {
  return (
    <ProtectedRoute>
      <section className={Style.inventoryList}>
        <InventoryListDeleteTable
          endpoint="molinos"
          redirectPath="windmill"
          title="un molino"
          head={["Nombre", "Horómetro"]}
          index="id_molino"
          body={["nombre_molino", "horometro_molino"]}
          optional={{ horometro_molino: "Hrs" }}
          name="molinos"
        />
      </section>
    </ProtectedRoute>
  );
}

export default InventoryListDeleteWindmill;
