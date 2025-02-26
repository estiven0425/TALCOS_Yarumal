import InventoryEditForm from "../components/InventoryEditForm";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/inventory-edit.module.css";

function InventoryEditRawMaterial() {
  const fields = [
    {
      name: "nombre_materia_prima",
      label: "Nombre",
      placeholder: "Ingresa el nombre de la materia prima",
      type: "text",
    },
    {
      name: "cantidad_materia_prima",
      label: "Cantidad",
      placeholder: "Ingresa la cantidad de la materia prima",
      type: "text",
    },
  ];

  return (
    <ProtectedRoute>
      <section className={Style.inventoryEdit}>
        <InventoryEditForm
          redirectPath="rawmaterial"
          fields={fields}
          dataId="id_materia_prima"
          endpoint="materias_primas"
          nameError="la materia prima"
          nameConfirmation="Materia prima editada"
          title="Complete los datos para editar la materia prima"
          nameButton="materia prima"
        />
      </section>
    </ProtectedRoute>
  );
}

export default InventoryEditRawMaterial;
