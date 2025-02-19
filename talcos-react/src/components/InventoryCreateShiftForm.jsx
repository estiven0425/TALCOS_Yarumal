import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Style from "./styles/inventory-create-shift-form.module.css";

function InventoryCreateShiftForm() {
  const [nombreTurno, setNombreTurno] = useState("");
  const [inicioTurno, setInicioTurno] = useState("");
  const [finTurno, setFinTurno] = useState("");
  const [loading, setLoading] = useState(false);
  const [SendStatus, setSendStatus] = useState(false);
  const [validationError, setValidationError] = useState({});
  const [serverError, setServerError] = useState(null);
  const navigate = useNavigate();
  const localIP = import.meta.env.VITE_LOCAL_IP;

  useEffect(() => {
    if (SendStatus) {
      const timer = setTimeout(() => {
        navigate("/inventoryshift");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [SendStatus, navigate]);

  const validation = () => {
    const errors = {};

    if (!nombreTurno) {
      errors.nombreTurno = "El nombre del turno es obligatorio.";
    }
    if (!inicioTurno) {
      errors.inicioTurno = "La hora de inicio del turno es obligatorio.";
    }
    if (!finTurno) {
      errors.finTurno = "La hora de finalización del turno es obligatorio.";
    }

    setValidationError(errors);
    setLoading(false);

    return Object.keys(errors).length === 0;
  };
  const sendCreateShift = async (e) => {
    e.preventDefault();

    if (!validation()) {
      return;
    }

    setServerError(null);
    setLoading(true);

    try {
      await axios.post(`http://${localIP}:3000/turnos`, {
        nombre_turno: nombreTurno,
        inicio_turno: inicioTurno,
        fin_turno: finTurno,
      });

      setSendStatus(true);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setServerError(error.response.data.error);
        setLoading(false);
      } else {
        setServerError(
          "Error al crear el turno. Por favor, inténtelo de nuevo."
        );
        setLoading(false);
      }
    }
  };
  const redirectInventory = () => {
    navigate("/inventoryshift");
  };

  return (
    <>
      {SendStatus === true ? (
        <motion.div
          className={Style.inventoryCreateShiftFormAlternative}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1>Turno creado con éxito</h1>
        </motion.div>
      ) : (
        <motion.form
          className={Style.inventoryCreateShiftForm}
          onSubmit={sendCreateShift}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <header className={Style.inventoryCreateShiftFormHeader}>
            <h1>Complete los datos para crear el turno</h1>
          </header>
          <main className={Style.inventoryCreateShiftFormMain}>
            <fieldset>
              <label htmlFor="nombreTurno">Nombre</label>
              <input
                id="nombreTurno"
                name="nombreTurno"
                onChange={(e) => setNombreTurno(e.target.value)}
                placeholder="Ingresa el nombre del turno"
                type="text"
                value={nombreTurno}
              />
              {!validationError.nombreTurno ? (
                <></>
              ) : (
                <motion.span
                  className={Style.inventoryCreateShiftFormValidation}
                  initial={{ zoom: 0 }}
                  animate={{ zoom: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {validationError.nombreTurno}
                </motion.span>
              )}
            </fieldset>
            <fieldset>
              <label htmlFor="inicioTurno">Hora de inicio</label>
              <input
                id="inicioTurno"
                name="inicioTurno"
                onChange={(e) => setInicioTurno(e.target.value)}
                type="time"
                value={inicioTurno}
              />
              {!validationError.inicioTurno ? (
                <></>
              ) : (
                <motion.span
                  className={Style.inventoryCreateShiftFormValidation}
                  initial={{ zoom: 0 }}
                  animate={{ zoom: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {validationError.inicioTurno}
                </motion.span>
              )}
            </fieldset>
            <fieldset>
              <label htmlFor="finTurno">Hora de finalización</label>
              <input
                id="finTurno"
                name="finTurno"
                onChange={(e) => setFinTurno(e.target.value)}
                type="time"
                value={finTurno}
              />
              {!validationError.finTurno ? (
                <></>
              ) : (
                <motion.span
                  className={Style.inventoryCreateShiftFormValidation}
                  initial={{ zoom: 0 }}
                  animate={{ zoom: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {validationError.finTurno}
                </motion.span>
              )}
            </fieldset>
          </main>
          <footer className={Style.inventoryCreateShiftFormFooter}>
            <button onClick={() => redirectInventory()} type="button">
              Cancelar
            </button>
            <button type="submit">
              {loading ? <div className={Style.loader}></div> : "Crear turno"}
            </button>
            {!serverError ? (
              <></>
            ) : (
              <motion.span
                className={Style.inventoryCreateShiftFormValidationServer}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {serverError}
              </motion.span>
            )}
          </footer>
        </motion.form>
      )}
    </>
  );
}

export default InventoryCreateShiftForm;
