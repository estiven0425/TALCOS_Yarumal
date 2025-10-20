import InventoryListDeleteTable from "../components/InventoryListDeleteTable";
import ProtectedRoute from "../utils/ProtectedRoute";

import Style from "./styles/inventory-list.module.css";

function InventoryListDeleteShift() {
  return (
    <ProtectedRoute>
      <section className={Style.inventoryList}>
        <InventoryListDeleteTable
          endpoint="turnos"
          redirectPath="shift"
          title="un turno"
          head={["Nombre", "Hora de inicio", "Hora de fin"]}
          index="id_turno"
          body={["nombre_turno", "inicio_turno", "fin_turno"]}
          optional={{ inicio_turno: "Hrs", fin_turno: "Hrs" }}
          name="turnos"
        />
      </section>
    </ProtectedRoute>
  );
}

export default InventoryListDeleteShift;
