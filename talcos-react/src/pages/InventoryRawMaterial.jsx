import InventoryList from "../components/InventoryList";
import InventoryRawMaterialButton from "../components/InventoryRawMaterialButton";
import ProtectedRoute from "../utils/ProtectedRoute";

import Style from "./styles/inventory-general.module.css";

function InventoryRawMaterial() {
  return (
    <ProtectedRoute>
      <section className={Style.inventory}>
        <InventoryRawMaterialButton />
        <main className={Style.inventoryMain}>
          <InventoryList
            location="materias_primas"
            head={["Nombre", "Cantidad"]}
            index="id_materia_prima"
            body={["nombre_materia_prima", "cantidad_materia_prima"]}
            optional={{ cantidad_materia_prima: "Tons" }}
            name="materias primas"
          />
        </main>
      </section>
    </ProtectedRoute>
  );
}

export default InventoryRawMaterial;
