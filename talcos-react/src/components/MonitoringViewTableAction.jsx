import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import MonitoringViewTableList from "./MonitoringViewTableList";
import Style from "./styles/monitoring-view-table-action.module.css";

function MonitoringViewTableAction() {
  const [anoMonitoreo, setAnoMonitoreo] = useState("");
  const [selectedItem, setSelectedItem] = useState({});
  const [validationError, setValidationError] = useState({});
  const navigate = useNavigate();

  const validation = () => {
    const errors = {};
    if (!anoMonitoreo.trim()) {
      errors.anoMonitoreo = "La fecha es obligatoria.";
    } else if (!/^[0-9]+$/.test(anoMonitoreo)) {
      errors.anoMonitoreo = "La decha debe ser solo numeros.";
    }
    if (anoMonitoreo && anoMonitoreo < 2000) {
      errors.anoMonitoreo = "La fecha debe ser mayor al año 2000.";
    }
    if (anoMonitoreo && anoMonitoreo > new Date().getFullYear()) {
      errors.anoMonitoreo = "La fecha debe ser menor o igual al año actual.";
    }
    setValidationError(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validation()) return;

    const inicio = `${anoMonitoreo}-01-01`;
    const fin = `${anoMonitoreo}-12-31`;

    setSelectedItem({
      inicioMonitoreo: inicio,
      finMonitoreo: fin,
    });
  };

  const redirectView = () => {
    navigate("/monitoring/mainmonitoring");
  };

  return (
    <>
      <motion.section
        className={Style.monitoringViewTableActionPrimary}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <MonitoringViewTableList
          inicioMonitoreo={selectedItem.inicioMonitoreo}
          finMonitoreo={selectedItem.finMonitoreo}
        />
      </motion.section>
      <motion.section
        className={Style.monitoringViewTableActionSecondary}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.header className={Style.monitoringViewTableActionHeader}>
          <h2>Establezca un año para realizar el monitoreo semanal</h2>
        </motion.header>
        <motion.main className={Style.monitoringViewTableActionMain}>
          <form
            className={Style.monitoringViewTableActionMainForm}
            onSubmit={handleSubmit}
          >
            <fieldset>
              <label htmlFor="anoMonitoreo">Año:</label>
              <input
                id="anoMonitoreo"
                name="anoMonitoreo"
                onChange={(e) => setAnoMonitoreo(e.target.value)}
                type="text"
                value={anoMonitoreo}
              />
            </fieldset>
            <button type="submit">Buscar</button>
            {validationError.anoMonitoreo && (
              <motion.span
                className={Style.monitoringViewTableActionMainValidation}
                initial={{ zoom: 0 }}
                animate={{ zoom: 1 }}
                transition={{ duration: 0.5 }}
              >
                {validationError.anoMonitoreo}
              </motion.span>
            )}
          </form>
        </motion.main>
        <motion.footer className={Style.monitoringViewTableActionFooter}>
          <button onClick={() => redirectView()} type="button">
            Vista manual
          </button>
        </motion.footer>
      </motion.section>
    </>
  );
}

export default MonitoringViewTableAction;
