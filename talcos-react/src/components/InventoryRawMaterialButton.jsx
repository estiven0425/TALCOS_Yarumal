import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import Style from "./styles/inventory-raw-material-button.module.css";

function InventoryRawMaterialButton() {
  const navigate = useNavigate();

  const redirectCreate = () => {
    navigate("/inventory/createrawmaterial");
  };

  const redirectEdit = () => {
    navigate("/inventory/listeditrawmaterial");
  };

  const redirectDelete = () => {
    navigate("/inventory/listdeleterawmaterial");
  };

  const redirectRegister = () => {
    navigate("/inventory/registerrawmaterial");
  };

  return (
    <>
      <motion.header
        className={Style.inventoryRawMaterialButtonHeader}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <button onClick={() => redirectCreate()} type="button">
          <h2>crear materia prima</h2>
          <img alt="Icono" src="/add.svg"></img>
        </button>
        <button onClick={() => redirectEdit()} type="button">
          <h2>editar materia prima</h2>
          <img alt="Icono" src="/edit.svg"></img>
        </button>
        <button onClick={() => redirectDelete()} type="button">
          <h2>eliminar materia prima</h2>
          <img alt="Icono" src="/delete.svg"></img>
        </button>
        <button
          className={Style.inventoryRawMaterialButtonHeaderEspecial}
          onClick={() => redirectRegister()}
          type="button"
        >
          <h2>Registros</h2>
          <img alt="Icono" src="/registro.svg"></img>
        </button>
      </motion.header>
    </>
  );
}

export default InventoryRawMaterialButton;
