import InventoryEditForm from "../components/InventoryEditForm";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/inventory-edit.module.css";

function InventoryEditInventoryAp() {
  const fields = [
    {
      name: "tipo_inventario_ap",
      label: "Tipo",
      placeholder: "Ingresa el tipo de inventario AP",
      type: "text",
    },
    {
      name: "nombre_inventario_ap",
      label: "Nombre",
      placeholder: "Ingresa el nombre del inventario AP",
      type: "text",
    },
    {
      name: "porcentaje_inventario_ap",
      label: "Porcentaje",
      placeholder: "Ingresa el porcentaje del inventario AP",
      type: "number",
    },
    {
      name: "total_inventario_ap",
      label: "Total",
      placeholder: "Ingresa el total del inventario AP en kilogramos",
      type: "number",
    },
  ];

  return (
    <ProtectedRoute>
      <section className={Style.inventoryEdit}>
        <InventoryEditForm
          redirectPath="inventoryap"
          fields={fields}
          dataId="id_inventario_ap"
          endpoint="inventario_ap"
          nameError="el inventario AP"
          nameConfirmation="Inventario AP editado"
          title="Complete los datos para editar el inventario AP"
          nameButton="inventario AP"
        />
      </section>
    </ProtectedRoute>
  );
}

export default InventoryEditInventoryAp;
