import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import Style from "./styles/inventory-rejected-material-button.module.css";

function InventoryRejectedMaterialButton() {
  const navigate = useNavigate();

  const redirectCreate = () => {
    navigate("/inventory/createrejectedmaterial");
  };

  const redirectEdit = () => {
    navigate("/inventory/listeditrejectedmaterial");
  };

  const redirectDelete = () => {
    navigate("/inventory/listdeleterejectedmaterial");
  };

  const redirectReasigned = () => {
    navigate("/inventory/listreasignedrejectedmaterial");
  };

  return (
    <>
      <motion.header
        className={Style.inventoryRejectedMaterialButtonHeader}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <button onClick={() => redirectCreate()} type="button">
          <h2>crear producto rechazado</h2>
          <img alt="Icono" src="/add.svg"></img>
        </button>
        <button onClick={() => redirectEdit()} type="button">
          <h2>editar producto rechazado</h2>
          <img alt="Icono" src="/edit.svg"></img>
        </button>
        <button onClick={() => redirectDelete()} type="button">
          <h2>eliminar producto rechazado</h2>
          <img alt="Icono" src="/delete.svg"></img>
        </button>
        <button
          className={Style.inventoryRejectedMaterialButtonHeaderEspecial}
          onClick={() => redirectReasigned()}
          type="button"
        >
          <h2>Reasignar</h2>
          <img alt="Icono" src="/registro.svg"></img>
        </button>
      </motion.header>
    </>
  );
}

export default InventoryRejectedMaterialButton;
