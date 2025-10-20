import MonitoringViewTableAction from "../components/MonitoringViewTableAction";
import ProtectedRoute from "../utils/ProtectedRoute";

import Style from "./styles/monitoring.module.css";

function MonitoringView() {
  return (
    <ProtectedRoute>
      <section className={Style.monitoring}>
        <MonitoringViewTableAction />
      </section>
    </ProtectedRoute>
  );
}

export default MonitoringView;
