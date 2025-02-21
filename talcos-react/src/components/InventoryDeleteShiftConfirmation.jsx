import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Style from "./styles/inventory-delete-shift-confirmation.module.css";

function InventoryDeleteShiftConfirmation() {
  const [idTurno, setIdTurno] = useState("");
  const [loading, setLoading] = useState(false);
  const [SendStatus, setSendStatus] = useState(false);
  const [serverError, setServerError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const shift = location.state || null;
  const localIP = import.meta.env.VITE_LOCAL_IP;

  useEffect(() => {
    if (shift) {
      setIdTurno(shift.id_turno);
    }
  }, [shift]);
  useEffect(() => {
    if (SendStatus) {
      const timer = setTimeout(() => {
        navigate("/listdeleteshift");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [SendStatus, navigate]);

  const sendDeleteShift = async () => {
    setServerError(null);
    setLoading(true);

    try {
      await axios.put(`http://${localIP}:3000/turnos/eliminarturno`, {
        id_turno: idTurno,
        actividad_turno: false,
      });

      setSendStatus(true);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setServerError(error.response.data.error);
        setLoading(false);
      } else {
        setServerError(
          "Error al eliminar el turno. Por favor, inténtelo de nuevo."
        );
        setLoading(false);
      }
    }
  };
  const redirectInventory = () => {
    navigate("/listdeleteshift");
  };

  return (
    <>
      {SendStatus === true ? (
        <motion.div
          className={Style.inventoryDeleteShiftConfirmationAlternative}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1>Turno eliminado con éxito</h1>
        </motion.div>
      ) : (
        <motion.div
          className={Style.inventoryDeleteShiftConfirmation}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <main className={Style.inventoryDeleteShiftConfirmationMain}>
            <h1>¿Seguro que desea eliminar el turno seleccionado?</h1>
          </main>
          <footer className={Style.inventoryDeleteShiftConfirmationFooter}>
            <button onClick={() => redirectInventory()} type="button">
              Cancelar
            </button>
            <button type="submit" onClick={() => sendDeleteShift()}>
              {loading ? (
                <div className={Style.loader}></div>
              ) : (
                "Eliminar turno"
              )}
            </button>
            {!serverError ? (
              <></>
            ) : (
              <motion.span
                className={Style.inventoryDeleteShiftConfirmationValidationServer}
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

export default InventoryDeleteShiftConfirmation;
