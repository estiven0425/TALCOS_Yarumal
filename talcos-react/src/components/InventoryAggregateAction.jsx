import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Style from "./styles/inventory-aggregate-action.module.css";
import log from "eslint-plugin-react/lib/util/log.js";

function InventoryAggregateAction({ item }) {
  const navigate = useNavigate();

  const redirectCreate = () => {
    navigate("/inventory/createaggregate");
  };
  const redirectDetail = () => {
    navigate("/inventory/detailaggregate", { state: item });
  };
  const redirectDelete = () => {
    navigate("/inventory/deleteaggregate", {
      state: item.id_registro_ap,
    });
  };

  return (
    <>
      {item ? (
        <>
          <motion.main
            className={Style.inventoryAggregateActionMain}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <h2>Titular</h2>
              <p>{item.titular?.nombre_usuario}</p>
            </div>
            <div>
              <h2>Operador AP</h2>
              <p>{item.operador?.nombre_usuario}</p>
            </div>
            <div>
              <h2>Operador de minicargador</h2>
              <p>{item.carguero?.nombre_usuario}</p>
            </div>
            <div>
              <h2>Molino AP</h2>
              <p>{item.molino_registro_ap}</p>
            </div>
            <div>
              <h2>Roca total</h2>
              <p>{item.total_roca_registro_ap} Kg</p>
            </div>
            <div>
              <h2>Grueso total</h2>
              <p>{item.total_grueso_registro_ap} Kg</p>
            </div>
          </motion.main>
          <motion.footer
            className={Style.inventoryAggregateActionFooterAlternative}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <button type="button" onClick={redirectDetail}>
              Detalles registro AP
            </button>
            <button type="button" onClick={redirectDelete}>
              Eliminar registro AP
            </button>
          </motion.footer>
        </>
      ) : (
        <>
          <motion.header
            className={Style.inventoryAggregateActionHeader}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2>Selecciona un registro AP para ver sus detalles y funciones</h2>
          </motion.header>
          <motion.main
            className={Style.inventoryAggregateActionMainAlternative}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2>O crea un nuevo registro</h2>
          </motion.main>
          <motion.footer
            className={Style.inventoryAggregateActionFooter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <button type="button" onClick={() => redirectCreate()}>
              Crear registro AP
            </button>
          </motion.footer>
        </>
      )}
    </>
  );
}

export default InventoryAggregateAction;
