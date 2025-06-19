import InventoryWindmillApButton from "../components/InventoryWindmillAPButton";
import InventoryList from "../components/InventoryList";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/inventory-general.module.css";

function InventoryWindmillAp() {
  return (
    <ProtectedRoute>
      <section className={Style.inventory}>
        <InventoryWindmillApButton />
        <main className={Style.inventoryMain}>
          <InventoryList
            location="molinos_ap"
            head={["Nombre", "Horómetro"]}
            index="id_molino_ap"
            body={["nombre_molino_ap", "horometro_molino_ap"]}
            optional={{ horometro_molino_ap: "Hrs" }}
            name="molinos AP"
          />
        </main>
      </section>
    </ProtectedRoute>
  );
}

export default InventoryWindmillAp;
