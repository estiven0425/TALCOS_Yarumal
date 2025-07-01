import InventoryCreateForm from "../components/InventoryCreateForm";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/inventory-create.module.css";

function InventoryCreateCommercialDispatche() {
  const fields = [
    {
      name: "fecha_despacho_comercial",
      label: "Fecha",
      placeholder: "Ingresa la fecha del despacho programado",
      type: "date",
      required: true,
      validationMessage: "la fecha del despacho programado es obligatoria.",
    },
    {
      name: "cantidad_despacho_comercial",
      label: "Cantidad",
      placeholder: "Ingresa la cantidad del despacho programado",
      type: "number",
      required: true,
      validationMessage: "La cantidad del despacho programado es obligatoria.",
    },
  ];

  return (
    <ProtectedRoute>
      <section className={Style.inventoryCreate}>
        <InventoryCreateForm
          redirectPath="commercialdispatche"
          fields={fields}
          endpoint="despachos_comerciales"
          nameError="el despacho programado"
          nameConfirmation="Despacho programado creado"
          title="Complete los datos para crear un nuevo despacho programado"
          nameButton="despacho programado"
        />
      </section>
    </ProtectedRoute>
  );
}

export default InventoryCreateCommercialDispatche;
