import InventoryDeleteConfirmation from "../components/InventoryDeleteConfirmation";
import ProtectedRoute from "../utils/ProtectedRoute";

import Style from "./styles/inventory-delete.module.css";

function InventoryDeleteRawMaterial() {
  return (
    <ProtectedRoute>
      <section className={Style.inventoryDelete}>
        <InventoryDeleteConfirmation
          dataId="id_materia_prima"
          redirectPath="rawmaterial"
          endpoint="materias_primas/eliminarmateriaprima"
          name="actividad_materia_prima"
          nameError="la materia prima"
          nameConfirmation="Materia prima eliminada"
          title="¿Seguro que desea eliminar la materia prima seleccionada?"
          nameButton="materia prima"
        />
      </section>
    </ProtectedRoute>
  );
}

export default InventoryDeleteRawMaterial;
