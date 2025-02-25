import InventoryListEditTable from "../components/InventoryListEditTable";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/inventory-list-edit.module.css";

function InventoryListEditWindmill() {
  return (
    <ProtectedRoute>
      <section className={Style.inventorytListEdit}>
        <InventoryListEditTable
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

export default InventoryListEditWindmill;
