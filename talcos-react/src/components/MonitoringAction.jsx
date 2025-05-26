import { motion } from "framer-motion";
import { useState } from "react";
import MonitoringList from "./MonitoringList";
import Style from "./styles/monitoring-action.module.css";

function MonitoringAction() {
  const [inicioMonitoreo, setInicioMonitoreo] = useState("");
  const [finMonitoreo, setFinMonitoreo] = useState("");

  return (
    <>
      <motion.section
        className={Style.monitoringActionPrimary}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <MonitoringList />
      </motion.section>
      <motion.section
        className={Style.monitoringActionSecondary}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.header
          className={Style.monitoringActionHeader}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2>Establezca una fecha para realizar el monitoreo</h2>
        </motion.header>
        <motion.main
          className={Style.monitoringActionMain}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <form className={Style.monitoringActionMainForm}>
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
          </form>
        </motion.main>
        <motion.footer
          className={Style.monitoringActionFooter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <button type="button">Imprimir</button>
        </motion.footer>
      </motion.section>
    </>
  );
}

export default MonitoringAction;
