import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Style from "./styles/inventory-windmill-button.module.css";

function InventoryWindmillButton() {
  const navigate = useNavigate();
  const redirectCreate = () => {
    navigate("/createwindmill");
  };
  const redirectEdit = () => {
    navigate("/listeditwindmill");
  };
  const redirectDelete = () => {
    navigate("/listdeletewindmill");
  };

  return (
    <>
      <motion.header
        className={Style.inventoryWindmillButtonHeader}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <button onClick={() => redirectCreate()} type="button">
          <h2>crear molino</h2>
          <img alt="Icono" src="/add.svg"></img>
        </button>
        <button onClick={() => redirectEdit()} type="button">
          <h2>editar molino</h2>
          <img alt="Icono" src="/edit.svg"></img>
        </button>
        <button onClick={() => redirectDelete()} type="button">
          <h2>eliminar molino</h2>
          <img alt="Icono" src="/delete.svg"></img>
        </button>
      </motion.header>
    </>
  );
}

export default InventoryWindmillButton;
