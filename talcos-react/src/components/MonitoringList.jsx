import { motion } from "framer-motion";
import MonitoringListEfficiency from "./MonitoringListEfficiency";
import MonitoringListHours from "./MonitoringListHours";
import MonitoringListProduced from "./MonitoringListProduced";
import MonitoringListStrike from "./MonitoringListStrike";
import PropTypes from "prop-types";
import Style from "./styles/monitoring-List.module.css";

MonitoringList.propTypes = {
  inicioMonitoreo: PropTypes.any,
  finMonitoreo: PropTypes.any,
};

function MonitoringList({ inicioMonitoreo, finMonitoreo }) {
  return (
    <>
      {inicioMonitoreo && finMonitoreo ? (
        <>
          <MonitoringListStrike inicio={inicioMonitoreo} fin={finMonitoreo} />
          <MonitoringListProduced inicio={inicioMonitoreo} fin={finMonitoreo} />
          <MonitoringListHours inicio={inicioMonitoreo} fin={finMonitoreo} />
          <MonitoringListEfficiency
            inicio={inicioMonitoreo}
            fin={finMonitoreo}
          />
        </>
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
