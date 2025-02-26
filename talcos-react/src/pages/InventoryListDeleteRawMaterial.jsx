import InventoryListDeleteTable from "../components/InventoryListDeleteTable";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/inventory-list-delete.module.css";

function InventoryListDeleteRawMaterial() {
  return (
    <ProtectedRoute>
      <section className={Style.inventoryListDelete}>
        <InventoryListDeleteTable
          endpoint="materias_primas"
          redirectPath="rawmaterial"
          title="una materia prima"
          head={["Nombre", "Cantidad"]}
          index="id_materia_prima"
          body={["nombre_materia_prima", "cantidad_materia_prima"]}
          optional={{ cantidad_materia_prima: "Tons" }}
          name="materias primas"
        />
      </section>
    </ProtectedRoute>
  );
}

export default InventoryListDeleteRawMaterial;
