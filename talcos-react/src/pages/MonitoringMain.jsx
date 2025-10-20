import MonitoringAction from "../components/MonitoringAction";
import ProtectedRoute from "../utils/ProtectedRoute";

import Style from "./styles/monitoring.module.css";

function MonitoringMain() {
  return (
    <ProtectedRoute>
      <section className={Style.monitoring}>
        <MonitoringAction />
      </section>
    </ProtectedRoute>
  );
}

export default MonitoringMain;
