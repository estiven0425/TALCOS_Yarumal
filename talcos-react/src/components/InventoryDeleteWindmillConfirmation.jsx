import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Style from "./styles/inventory-delete-windmill-confirmation.module.css";

function InventoryDeleteWindmillConfirmation() {
  const [idMolino, setIdMolino] = useState("");
  const [loading, setLoading] = useState(false);
  const [SendStatus, setSendStatus] = useState(false);
  const [serverError, setServerError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const windmill = location.state || null;
  const localIP = import.meta.env.VITE_LOCAL_IP;

  useEffect(() => {
    if (windmill) {
      setIdMolino(windmill.id_molino);
    }
  }, [windmill]);
  useEffect(() => {
    if (SendStatus) {
      const timer = setTimeout(() => {
        navigate("/listdeletewindmill");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [SendStatus, navigate]);

  const sendDeleteWindmill = async () => {
    setServerError(null);
    setLoading(true);

    try {
      await axios.put(`http://${localIP}:3000/molinos/eliminarmolino`, {
        id_molino: idMolino,
        actividad_molino: false,
      });

      setSendStatus(true);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setServerError(error.response.data.error);
        setLoading(false);
      } else {
        setServerError(
          "Error al eliminar el molino. Por favor, inténtelo de nuevo."
        );
        setLoading(false);
      }
    }
  };
  const redirectInventory = () => {
    navigate("/listdeletewindmill");
  };

  return (
    <>
      {SendStatus === true ? (
        <motion.div
          className={Style.inventoryDeleteWindmillConfirmationAlternative}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1>Molino eliminado con éxito</h1>
        </motion.div>
      ) : (
        <motion.div
          className={Style.inventoryDeleteWindmillConfirmation}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <main className={Style.inventoryDeleteWindmillConfirmationMain}>
            <h1>¿Seguro que desea eliminar el molino seleccionado?</h1>
          </main>
          <footer className={Style.inventoryDeleteWindmillConfirmationFooter}>
            <button onClick={() => redirectInventory()} type="button">
              Cancelar
            </button>
            <button type="submit" onClick={() => sendDeleteWindmill()}>
              {loading ? (
                <div className={Style.loader}></div>
              ) : (
                "Eliminar molino"
              )}
            </button>
            {!serverError ? (
              <></>
            ) : (
              <motion.span
                className={
                  Style.inventoryDeleteWindmillConfirmationValidationServer
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

export default InventoryDeleteWindmillConfirmation;
