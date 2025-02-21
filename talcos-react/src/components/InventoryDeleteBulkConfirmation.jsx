import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Style from "./styles/inventory-delete-bultk-confirmation.module.css";

function InventoryDeleteBulkConfirmation() {
  const [idBulto, setIdBulto] = useState("");
  const [loading, setLoading] = useState(false);
  const [SendStatus, setSendStatus] = useState(false);
  const [serverError, setServerError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const bulk = location.state || null;
  const localIP = import.meta.env.VITE_LOCAL_IP;

  useEffect(() => {
    if (bulk) {
      setIdBulto(bulk.id_bulto);
    }
  }, [bulk]);
  useEffect(() => {
    if (SendStatus) {
      const timer = setTimeout(() => {
        navigate("/listdeletebulk");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [SendStatus, navigate]);

  const sendDeleteBulk = async () => {
    setServerError(null);
    setLoading(true);

    try {
      await axios.put(`http://${localIP}:3000/bultos/eliminarbulto`, {
        id_bulto: idBulto,
        actividad_bulto: false,
      });

      setSendStatus(true);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setServerError(error.response.data.error);
        setLoading(false);
      } else {
        setServerError(
          "Error al eliminar el bulto. Por favor, inténtelo de nuevo."
        );
        setLoading(false);
      }
    }
  };
  const redirectInventory = () => {
    navigate("/listdeletebulk");
  };

  return (
    <>
      {SendStatus === true ? (
        <motion.div
          className={Style.inventoryDeleteBulkConfirmationAlternative}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1>Bulto eliminado con éxito</h1>
        </motion.div>
      ) : (
        <motion.div
          className={Style.inventoryDeleteBulkConfirmation}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <main className={Style.inventoryDeleteBulkConfirmationMain}>
            <h1>¿Seguro que desea eliminar el bulto seleccionado?</h1>
          </main>
          <footer className={Style.inventoryDeleteBulkConfirmationFooter}>
            <button onClick={() => redirectInventory()} type="button">
              Cancelar
            </button>
            <button type="submit" onClick={() => sendDeleteBulk()}>
              {loading ? (
                <div className={Style.loader}></div>
              ) : (
                "Eliminar bulto"
              )}
            </button>
            {!serverError ? (
              <></>
            ) : (
              <motion.span
                className={
                  Style.inventoryDeleteBulkConfirmationValidationServer
                }
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {serverError}
              </motion.span>
            )}
          </footer>
        </motion.div>
      )}
    </>
  );
}

export default InventoryDeleteBulkConfirmation;
