import { motion } from "framer-motion";
import Style from "./styles/monitoring-action.module.css";

function MonitoringAction() {
  return (
    <>
      <motion.header
        className={Style.monitoringActionHeader}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2>Hola</h2>
      </motion.header>
      <motion.main
        className={Style.monitoringActionMain}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      ></motion.main>
      <motion.footer
        className={Style.monitoringActionFooter}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <button type="button">Detalles informe</button>
      </motion.footer>
    </>
  );
}

export default MonitoringAction;
