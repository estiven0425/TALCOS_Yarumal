import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Style from "./styles/inventory-delete-reference-confirmation.module.css";

function InventoryDeleteReferenceConfirmation() {
  const [idReferencia, setIdReferencia] = useState("");
  const [loading, setLoading] = useState(false);
  const [SendStatus, setSendStatus] = useState(false);
  const [serverError, setServerError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const reference = location.state || null;
  const localIP = import.meta.env.VITE_LOCAL_IP;

  useEffect(() => {
    if (reference) {
      setIdReferencia(reference.id_referencia);
    }
  }, [reference]);
  useEffect(() => {
    if (SendStatus) {
      const timer = setTimeout(() => {
        navigate("/listdeletereference");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [SendStatus, navigate]);

  const sendDeleteReference = async () => {
    setServerError(null);
    setLoading(true);

    try {
      await axios.put(`http://${localIP}:3000/referencias/eliminarreferencia`, {
        id_referencia: idReferencia,
        actividad_referencia: false,
      });

      setSendStatus(true);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setServerError(error.response.data.error);
        setLoading(false);
      } else {
        setServerError(
          "Error al eliminar la referencia. Por favor, inténtelo de nuevo."
        );
        setLoading(false);
      }
    }
  };
  const redirectInventory = () => {
    navigate("/listdeletereference");
  };

  return (
    <>
      {SendStatus === true ? (
        <motion.div
          className={Style.inventoryDeleteReferenceConfirmationAlternative}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1>Referencia eliminada con éxito</h1>
        </motion.div>
      ) : (
        <motion.div
          className={Style.inventoryDeleteReferenceConfirmation}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <main className={Style.inventoryDeleteReferenceConfirmationMain}>
            <h1>¿Seguro que desea eliminar la referencia seleccionada?</h1>
          </main>
          <footer className={Style.inventoryDeleteReferenceConfirmationFooter}>
            <button onClick={() => redirectInventory()} type="button">
              Cancelar
            </button>
            <button type="submit" onClick={() => sendDeleteReference()}>
              {loading ? (
                <div className={Style.loader}></div>
              ) : (
                "Eliminar referencia"
              )}
            </button>
            {!serverError ? (
              <></>
            ) : (
              <motion.span
                className={
                  Style.inventoryDeleteReferenceConfirmationValidationServer
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

export default InventoryDeleteReferenceConfirmation;
