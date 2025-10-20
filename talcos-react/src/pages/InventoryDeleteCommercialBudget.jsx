import InventoryDeleteConfirmation from "../components/InventoryDeleteConfirmation";
import ProtectedRoute from "../utils/ProtectedRoute";

import Style from "./styles/inventory-delete.module.css";

function InventoryDeleteCommercialBudget() {
  return (
    <ProtectedRoute>
      <section className={Style.inventoryDelete}>
        <InventoryDeleteConfirmation
          dataId="id_presupuesto_comercial"
          redirectPath="commercialbudget"
          endpoint="presupuestos_comerciales/eliminarpresupuestocomercial"
          name="actividad_presupuesto_comercial"
          nameError="el presupuesto comercial"
          nameConfirmation="Presupuesto comercial eliminado"
          title="¿Seguro que desea eliminar el presupuesto comercial seleccionado?"
          nameButton="presupuesto comercial"
        />
      </section>
    </ProtectedRoute>
  );
}

export default InventoryDeleteCommercialBudget;
