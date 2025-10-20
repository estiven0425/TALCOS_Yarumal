import InventoryListEditTable from "../components/InventoryListEditTable";
import ProtectedRoute from "../utils/ProtectedRoute";

import Style from "./styles/inventory-list.module.css";

function InventoryListEditCommercialBudget() {
  return (
    <ProtectedRoute>
      <section className={Style.inventoryList}>
        <InventoryListEditTable
          endpoint="presupuestos_comerciales"
          redirectPath="commercialbudget"
          title="un presupuesto comercial"
          head={["Fecha", "Capacidad"]}
          index="id_presupuesto_comercial"
          body={[
            "fecha_presupuesto_comercial",
            "capacidad_presupuesto_comercial",
          ]}
          optional={{ capacidad_presupuesto_comercial: "Tons" }}
          name="presupuestos comerciales"
        />
      </section>
    </ProtectedRoute>
  );
}

export default InventoryListEditCommercialBudget;
