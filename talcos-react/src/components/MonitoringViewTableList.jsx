import { motion } from "framer-motion";
import MonitoringViewTableListCommercialBudget from "./MonitoringViewTableListCommercialBudget";
import MonitoringViewTableListDispatche from "./MonitoringViewTableListDispatche";
import MonitoringViewTableListEfficiency from "./MonitoringViewTableListEfficiency";
import MonitoringViewTableListProduced from "./MonitoringViewTableListProduced";
import Style from "./styles/monitoring-view-table-List.module.css";

function MonitoringViewTableList({ inicioMonitoreo, finMonitoreo }) {
  return (
    <>
      {inicioMonitoreo && finMonitoreo ? (
        <>
          <MonitoringViewTableListEfficiency
            inicio={inicioMonitoreo}
            fin={finMonitoreo}
          />
          <MonitoringViewTableListProduced
            inicio={inicioMonitoreo}
            fin={finMonitoreo}
          />
          <MonitoringViewTableListCommercialBudget
            inicio={inicioMonitoreo}
            fin={finMonitoreo}
          />
          <MonitoringViewTableListDispatche
            inicio={inicioMonitoreo}
            fin={finMonitoreo}
          />
        </>
      ) : (
        <motion.div
          className={Style.monitoringViewTableList}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1>Ingresa un año en el panel derecho</h1>
        </motion.div>
      )}
    </>
  );
}

export default MonitoringViewTableList;
