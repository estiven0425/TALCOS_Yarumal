import InventoryEditForm from "../components/InventoryEditForm";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/inventory-edit.module.css";

function InventoryEditCommercialDispatche() {
  const fields = [
    {
      name: "fecha_despacho_comercial",
      label: "Fecha",
      placeholder: "Ingresa la fecha del despacho programado",
      type: "date",
    },
    {
      name: "cantidad_despacho_comercial",
      label: "Cantidad",
      placeholder: "Ingresa la cantidad del despacho programado",
      type: "number",
    },
  ];

  return (
    <ProtectedRoute>
      <section className={Style.inventoryEdit}>
        <InventoryEditForm
          redirectPath="commercialdispatche"
          fields={fields}
          dataId="id_despacho_comercial"
          endpoint="despachos_comerciales"
          nameError="el despacho programado"
          nameConfirmation="Despacho programado editado"
          title="Complete los datos para editar el despacho programado"
          nameButton="despacho programado"
        />
      </section>
    </ProtectedRoute>
  );
}

export default InventoryEditCommercialDispatche;
