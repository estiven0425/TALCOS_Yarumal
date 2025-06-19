import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Style from "./styles/inventory-windmill-ap-button.module.css";

function InventoryWindmillApButton() {
  const navigate = useNavigate();
  const redirectCreate = () => {
    navigate("/inventory/createwindmillap");
  };
  const redirectEdit = () => {
    navigate("/inventory/listeditwindmillap");
  };
  const redirectDelete = () => {
    navigate("/inventory/listdeletewindmillap");
  };
  const redirectRegister = () => {
    navigate("/inventory/registerwindmillap");
  };

  return (
    <>
      <motion.header
        className={Style.inventoryWindmillApButtonHeader}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <button onClick={() => redirectCreate()} type="button">
          <h2>crear molino AP</h2>
          <img alt="Icono" src="/add.svg"></img>
        </button>
        <button onClick={() => redirectEdit()} type="button">
          <h2>editar molino AP</h2>
          <img alt="Icono" src="/edit.svg"></img>
        </button>
        <button onClick={() => redirectDelete()} type="button">
          <h2>eliminar molino AP</h2>
          <img alt="Icono" src="/delete.svg"></img>
        </button>
        <button
          className={Style.inventoryWindmillApButtonHeaderEspecial}
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

export default InventoryWindmillApButton;
