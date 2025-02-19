import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Style from "./styles/inventory-edit-shift-form.module.css";

function InventoryEditShiftForm() {
  const [idTurno, setIdTurno] = useState("");
  const [nombreTurno, setNombreTurno] = useState("");
  const [inicioTurno, setInicioTurno] = useState("");
  const [finTurno, setFinTurno] = useState("");
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
      setNombreTurno(shift.nombre_turno);
      setInicioTurno(shift.inicio_turno);
      setFinTurno(shift.fin_turno);
    }
  }, [shift]);
  useEffect(() => {
    if (SendStatus) {
      const timer = setTimeout(() => {
        navigate("/listeditshift");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [SendStatus, navigate]);

  const sendEditShift = async (e) => {
    e.preventDefault();

    setIdTurno(shift.id_turno);
    setServerError(null);
    setLoading(true);

    try {
      await axios.put(`http://${localIP}:3000/turnos`, {
        id_turno: idTurno,
        nombre_turno: nombreTurno === "" ? shift.nombre_turno : nombreTurno,
        inicio_turno: inicioTurno === "" ? shift.inicio_turno : inicioTurno,
        fin_turno: finTurno === "" ? shift.fin_turno : finTurno,
      });

      setSendStatus(true);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setServerError(error.response.data.error);
        setLoading(false);
      } else {
        setServerError(
          "Error al editar el turno. Por favor, inténtelo de nuevo."
        );
        setLoading(false);
      }
    }
  };
  const redirectInventory = () => {
    navigate("/listeditshift");
  };

  return (
    <>
      {SendStatus === true ? (
        <motion.div
          className={Style.inventoryEditShiftFormAlternative}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1>Turno editado con éxito</h1>
        </motion.div>
      ) : (
        <motion.form
          className={Style.inventoryEditShiftForm}
          onSubmit={sendEditShift}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <header className={Style.inventoryEditShiftFormHeader}>
            <h1>Complete los datos para editar el turno</h1>
          </header>
          <main className={Style.inventoryEditShiftFormMain}>
            <fieldset>
              <label htmlFor="nombreTurno">Nombre</label>
              <input
                id="nombreTurno"
                name="nombreTurno"
                onChange={(e) => setNombreTurno(e.target.value)}
                placeholder={shift.nombre_turno}
                type="text"
                value={nombreTurno}
              />
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
            </fieldset>
          </main>
          <footer className={Style.inventoryEditShiftFormFooter}>
            <button onClick={() => redirectInventory()} type="button">
              Cancelar
            </button>
            <button type="submit">
              {loading ? <div className={Style.loader}></div> : "Editar turno"}
            </button>
            {!serverError ? (
              <></>
            ) : (
              <motion.span
                className={Style.inventoryEditShiftFormValidationServer}
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

export default InventoryEditShiftForm;
