import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import axios from "axios";
import PropTypes from "prop-types";

import Style from "./styles/inventory-delete-confirmation.module.css";

InventoryDeleteConfirmation.propTypes = {
  dataId: PropTypes.any,
  redirectPath: PropTypes.any,
  endpoint: PropTypes.any,
  name: PropTypes.any,
  nameError: PropTypes.any,
  nameConfirmation: PropTypes.any,
  title: PropTypes.any,
  nameButton: PropTypes.any,
};

function InventoryDeleteConfirmation({
  dataId,
  redirectPath,
  endpoint,
  name,
  nameError,
  nameConfirmation,
  title,
  nameButton,
}) {
  const [idItem, setIdItem] = useState("");
  const [loading, setLoading] = useState(false);
  const [sendStatus, setSendStatus] = useState(false);
  const [serverError, setServerError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const item = location.state || null;
  const localIP = import.meta.env.VITE_LOCAL_IP;

  useEffect(() => {
    if (item) {
      setIdItem(item[dataId]);
    }
  }, [item, dataId]);

  useEffect(() => {
    if (sendStatus) {
      const timer = setTimeout(() => {
        navigate(`/inventory/listdelete${redirectPath}`);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [sendStatus, navigate, redirectPath]);

  const sendDelete = async () => {
    setServerError(null);
    setLoading(true);

    try {
      // noinspection HttpUrlsUsage
      await axios.put(`http://${localIP}:3000/${endpoint}`, {
        [dataId]: idItem,
        [name]: false,
      });

      setSendStatus(true);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setServerError(error.response.data.error);

        setLoading(false);
      } else {
        setServerError(
          `Error al eliminar ${nameError}. Por favor, inténtelo de nuevo.`,
        );
        setLoading(false);
      }
    }
  };

  const redirectInventory = () => {
    navigate(`/inventory/listdelete${redirectPath}`);
  };

  // noinspection JSValidateTypes
  return (
    <>
      {sendStatus === true ? (
        <motion.div
          className={Style.inventoryDeleteConfirmationAlternative}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1>{nameConfirmation} con éxito</h1>
        </motion.div>
      ) : (
        <motion.div
          className={Style.inventoryDeleteConfirmation}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <main className={Style.inventoryDeleteConfirmationMain}>
            <h1>{title}</h1>
          </main>
          <footer className={Style.inventoryDeleteConfirmationFooter}>
            <button onClick={() => redirectInventory()} type="button">
              Cancelar
            </button>
            <button type="button" onClick={() => sendDelete()}>
              {loading ? (
                <div className={Style.loader}></div>
              ) : (
                `Eliminar ${nameButton}`
              )}
            </button>
            {!serverError ? (
              <></>
            ) : (
              <motion.span
                className={Style.inventoryDeleteConfirmationValidationServer}
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

export default InventoryDeleteConfirmation;
