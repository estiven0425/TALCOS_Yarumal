import InventoryButton from "../components/InventoryButton";
import InventoryList from "../components/InventoryList";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/inventory-general.module.css";

function InventoryCommercialBudget() {
  return (
    <ProtectedRoute>
      <section className={Style.inventory}>
        <InventoryButton
          location="commercialbudget"
          name="presupuesto comercial"
        />
        <main className={Style.inventoryMain}>
          <InventoryList
            location="presupuestos_comerciales"
            head={["Fecha", "Capacidad"]}
            index="id_presupuesto_comercial"
            body={[
              "fecha_presupuesto_comercial",
              "capacidad_presupuesto_comercial",
            ]}
            optional={{ capacidad_presupuesto_comercial: "Tons" }}
            name="presupuestos comerciales"
          />
        </main>
      </section>
    </ProtectedRoute>
  );
}

export default InventoryCommercialBudget;
