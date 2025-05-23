import { motion } from "framer-motion";
import MonitoringAction from "./MonitoringAction";
import Style from "./styles/monitoring-List.module.css";

function MonitoringList() {
  return (
    <>
      <motion.section
        className={Style.monitoringListPrimary}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2>Hola</h2>
      </motion.section>
      <motion.section
        className={Style.monitoringListSecondary}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <MonitoringAction />
      </motion.section>
    </>
  );
}

export default MonitoringList;
