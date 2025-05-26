import { motion } from "framer-motion";
import Style from "./styles/monitoring-List.module.css";

function MonitoringList(inicioMonitoreo, finMonitoreo) {
  return (
    <>
      <motion.table
        className={Style.monitoringTable}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2>Componente acá</h2>
      </motion.table>
    </>
  );
}

export default MonitoringList;
