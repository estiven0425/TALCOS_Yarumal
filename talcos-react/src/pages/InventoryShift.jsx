import InventoryButton from "../components/InventoryButton";
import InventoryList from "../components/InventoryList";
import ProtectedRoute from "../utils/ProtectedRoute";

import Style from "./styles/inventory-general.module.css";

function InventoryShift() {
  return (
    <ProtectedRoute>
      <section className={Style.inventory}>
        <InventoryButton location="shift" name="turno" />
        <main className={Style.inventoryMain}>
          <InventoryList
            location="turnos"
            head={["Nombre", "Hora de inicio", "Hora de fin"]}
            index="id_turno"
            body={["nombre_turno", "inicio_turno", "fin_turno"]}
            optional={{ inicio_turno: "Hrs", fin_turno: "Hrs" }}
            name="turnos"
          />
        </main>
      </section>
    </ProtectedRoute>
  );
}

export default InventoryShift;
