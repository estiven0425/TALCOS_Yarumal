import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Style from "./styles/inventory-list-profile.module.css";

function InventoryListProfile() {
  const navigate = useNavigate();

  const redirect = (category) => {
    navigate(`/${category}`);
  };

  return (
    <>
      <motion.header
        className={Style.inventoryListProfileHeader}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1>
          Seleccione una categoría para acceder a su contenido y funciones
        </h1>
      </motion.header>
      <motion.main
        className={Style.inventoryListProfileMain}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <button
          className={Style.inventoryListProfileMainButton}
          onClick={() => redirect("inventory/inventoryshift")}
          type="button"
        >
          <h2>Turnos</h2>
          <img alt="Icono" src="/turno.svg"></img>
        </button>
        <button
          className={Style.inventoryListProfileMainButton}
          onClick={() => redirect("inventory/inventorywindmill")}
          type="button"
        >
          <h2>Molinos</h2>
          <img alt="Icono" src="/molino.svg"></img>
        </button>
        <button
          className={Style.inventoryListProfileMainButton}
          onClick={() => redirect("inventory/inventorywindmillap")}
          type="button"
        >
          <h2>Molinos AP</h2>
          <img alt="Icono" src="/molinosap.svg"></img>
        </button>
        <button
          className={Style.inventoryListProfileMainButton}
          onClick={() => redirect("inventory/inventoryreference")}
          type="button"
        >
          <h2>Referencias</h2>
          <img alt="Icono" src="/referencia.svg"></img>
        </button>
        <button
          className={Style.inventoryListProfileMainButton}
          onClick={() => redirect("inventory/inventorybulk")}
          type="button"
        >
          <h2>Bultos</h2>
          <img alt="Icono" src="/bulto.svg"></img>
        </button>
        <button
          className={Style.inventoryListProfileMainButton}
          onClick={() => redirect("inventory/inventoryrawmaterial")}
          type="button"
        >
          <h2>Materia prima</h2>
          <img alt="Icono" src="/materiaprima.svg"></img>
        </button>
        <button
          className={Style.inventoryListProfileMainButton}
          onClick={() => redirect("inventory/inventoryrejectedmaterial")}
          type="button"
        >
          <h2>Productos rechazados</h2>
          <img alt="Icono" src="/productorechazado.svg"></img>
        </button>
        <button
          className={Style.inventoryListProfileMainButton}
          onClick={() => redirect("inventory/inventoryprofile")}
          type="button"
        >
          <h2>Perfiles</h2>
          <img alt="Icono" src="/perfil.svg"></img>
        </button>
        <button
          className={Style.inventoryListProfileMainButton}
          onClick={() => redirect("inventory/inventorybobcat")}
          type="button"
        >
          <h2>Bob - Cat</h2>
          <img alt="Icono" src="/bobcat.svg"></img>
        </button>
        <button
          className={Style.inventoryListProfileMainButton}
          onClick={() => redirect("inventory/inventorybobcat")}
          type="button"
        >
          <h2>Despachos</h2>
          <img alt="Icono" src="/despachos.svg"></img>
        </button>
      </motion.main>
    </>
  );
}

export default InventoryListProfile;
