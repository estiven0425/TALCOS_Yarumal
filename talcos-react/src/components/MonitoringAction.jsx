import { motion } from "framer-motion";
import { useState } from "react";
import MonitoringList from "./MonitoringList";
import Style from "./styles/monitoring-action.module.css";

function MonitoringAction() {
  const [inicioMonitoreo, setInicioMonitoreo] = useState("");
  const [finMonitoreo, setFinMonitoreo] = useState("");
  const [selectedItem, setSelectedItem] = useState({});
  const [validationError, setValidationError] = useState({});

  const validation = () => {
    const errors = {};

    if (!inicioMonitoreo.trim()) {
      errors.inicioMonitoreo = "La fecha de inicio es obligatoria.";
    }
    if (!finMonitoreo.trim()) {
      errors.finMonitoreo = "La fecha de fin es obligatoria.";
    }
    if (finMonitoreo && new Date(finMonitoreo) < new Date(inicioMonitoreo)) {
      errors.finMonitoreo = "La fecha de fin debe ser mayor que la de inicio.";
    }

    setValidationError(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validation()) {
      return;
    }

    setSelectedItem({
      inicioMonitoreo: inicioMonitoreo,
      finMonitoreo: finMonitoreo,
    });
  };

  return (
    <>
      <motion.section
        className={Style.monitoringActionPrimary}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <MonitoringList
          inicioMonitoreo={selectedItem.inicioMonitoreo}
          finMonitoreo={selectedItem.finMonitoreo}
        />
      </motion.section>
      <motion.section
        className={Style.monitoringActionSecondary}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.header className={Style.monitoringActionHeader}>
          <h2>Establezca una fecha para realizar el monitoreo</h2>
        </motion.header>
        <motion.main className={Style.monitoringActionMain}>
          <form
            className={Style.monitoringActionMainForm}
            onSubmit={handleSubmit}
          >
            <fieldset>
              <label htmlFor="inicioMonitoreo">Desde:</label>
              <input
                id="inicioMonitoreo"
                name="inicioMonitoreo"
                onChange={(e) => setInicioMonitoreo(e.target.value)}
                type="date"
                value={inicioMonitoreo}
              />
            </fieldset>
            <fieldset>
              <label htmlFor="finMonitoreo">Hasta:</label>
              <input
                id="finMonitoreo"
                name="finMonitoreo"
                onChange={(e) => setFinMonitoreo(e.target.value)}
                type="date"
                value={finMonitoreo}
              />
            </fieldset>
            <button type="submit">Buscar</button>
            {validationError.inicioMonitoreo && (
              <motion.span
                className={Style.monitoringActionMainValidation}
                initial={{ zoom: 0 }}
                animate={{ zoom: 1 }}
                transition={{ duration: 0.5 }}
              >
                {validationError.inicioMonitoreo}
              </motion.span>
            )}
            {validationError.finMonitoreo && (
              <motion.span
                className={Style.monitoringActionMainValidation}
                initial={{ zoom: 0 }}
                animate={{ zoom: 1 }}
                transition={{ duration: 0.5 }}
              >
                {validationError.finMonitoreo}
              </motion.span>
            )}
          </form>
        </motion.main>
        <motion.footer className={Style.monitoringActionFooter}>
          <button type="button">Vista semanal</button>
          <button type="button">Imprimir monitoreo</button>
        </motion.footer>
      </motion.section>
    </>
  );
}

export default MonitoringAction;
