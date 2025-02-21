import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Style from "./styles/inventory-bulk-button.module.css";

function InventoryBulkButton() {
  const navigate = useNavigate();
  const redirectCreate = () => {
    navigate("/createbulk");
  };
  const redirectEdit = () => {
    navigate("/listeditbulk");
  };
  const redirectDelete = () => {
    navigate("/listdeletebulk");
  };

  return (
    <>
      <motion.header
        className={Style.inventoryBulkButtonHeader}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <button onClick={() => redirectCreate()} type="button">
          <h2>crear bulto</h2>
          <img alt="Icono" src="/add.svg"></img>
        </button>
        <button onClick={() => redirectEdit()} type="button">
          <h2>editar bulto</h2>
          <img alt="Icono" src="/edit.svg"></img>
        </button>
        <button onClick={() => redirectDelete()} type="button">
          <h2>eliminar bulto</h2>
          <img alt="Icono" src="/delete.svg"></img>
        </button>
      </motion.header>
    </>
  );
}

export default InventoryBulkButton;
