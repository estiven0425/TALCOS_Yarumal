import InventoryEditForm from "../components/InventoryEditForm";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/inventory-edit.module.css";

function InventoryEditDispatche() {
  const fields = [
    {
      name: "fecha_despacho",
      label: "Fecha",
      placeholder: "Ingresa la fecha del despacho",
      type: "date",
    },
    {
      name: "cantidad_despacho",
      label: "Cantidad",
      placeholder: "Ingresa la cantidad de despachos",
      type: "number",
    },
  ];

  return (
    <ProtectedRoute>
      <section className={Style.inventoryEdit}>
        <InventoryEditForm
          redirectPath="dispatche"
          fields={fields}
          dataId="id_despacho"
          endpoint="despachos"
          nameError="el despacho"
          nameConfirmation="Despacho editado"
          title="Complete los datos para editar el despacho"
          nameButton="despacho"
        />
      </section>
    </ProtectedRoute>
  );
}

export default InventoryEditDispatche;
