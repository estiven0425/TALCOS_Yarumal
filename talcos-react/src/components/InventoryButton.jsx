import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Style from "./styles/inventory-button.module.css";

function InventoryButton({ location, name }) {
  const navigate = useNavigate();
  const redirectCreate = () => {
    navigate(`/create${location}`);
  };
  const redirectEdit = () => {
    navigate(`/listedit${location}`);
  };
  const redirectDelete = () => {
    navigate(`/listdelete${location}`);
  };

  return (
    <>
      <motion.header
        className={Style.inventoryButtonHeader}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <button onClick={() => redirectCreate()} type="button">
          <h2>crear {name}</h2>
          <img alt="Icono" src="/add.svg"></img>
        </button>
        <button onClick={() => redirectEdit()} type="button">
          <h2>editar {name}</h2>
          <img alt="Icono" src="/edit.svg"></img>
        </button>
        <button onClick={() => redirectDelete()} type="button">
          <h2>eliminar {name}</h2>
          <img alt="Icono" src="/delete.svg"></img>
        </button>
      </motion.header>
    </>
  );
}

export default InventoryButton;
