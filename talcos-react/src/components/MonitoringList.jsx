import { motion } from "framer-motion";
import Style from "./styles/monitoring-List.module.css";
import MonitoringListStrike from "./MonitoringListStrike";

function MonitoringList({ inicioMonitoreo, finMonitoreo }) {
  return (
    <>
      {inicioMonitoreo && finMonitoreo ? (
        <MonitoringListStrike inicio={inicioMonitoreo} fin={finMonitoreo} />
      ) : (
        <motion.div
          className={Style.monitoringList}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1>Ingresa una fecha en el panel derecho</h1>
        </motion.div>
      )}
    </>
  );
}

export default MonitoringList;
