import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Style from "./styles/inventory-reference-button.module.css";

function InventoryReferenceButton() {
  const navigate = useNavigate();
  const redirectCreate = () => {
    navigate("/createreference");
  };
  const redirectEdit = () => {
    navigate("/listeditreference");
  };
  const redirectDelete = () => {
    navigate("/listdeletereference");
  };

  return (
    <>
      <motion.header
        className={Style.inventoryReferenceButtonHeader}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <button onClick={() => redirectCreate()} type="button">
          <h2>crear referencia</h2>
          <img alt="Icono" src="/add.svg"></img>
        </button>
        <button onClick={() => redirectEdit()} type="button">
          <h2>editar referencia</h2>
          <img alt="Icono" src="/edit.svg"></img>
        </button>
        <button onClick={() => redirectDelete()} type="button">
          <h2>eliminar referencia</h2>
          <img alt="Icono" src="/delete.svg"></img>
        </button>
      </motion.header>
    </>
  );
}

export default InventoryReferenceButton;
