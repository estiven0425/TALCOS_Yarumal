import InventoryListEditTable from "../components/InventoryListEditTable";
import ProtectedRoute from "../utils/ProtectedRoute";

import Style from "./styles/inventory-list.module.css";

function InventoryListEditWindmillAp() {
  return (
    <ProtectedRoute>
      <section className={Style.inventoryList}>
        <InventoryListEditTable
          endpoint="molinos_ap"
          redirectPath="windmillap"
          title="un molino AP"
          head={["Nombre", "Horómetro"]}
          index="id_molino_ap"
          body={["nombre_molino_ap", "horometro_molino_ap"]}
          optional={{ horometro_molino_ap: "Hrs" }}
          name="molinos AP"
        />
      </section>
    </ProtectedRoute>
  );
}

export default InventoryListEditWindmillAp;
