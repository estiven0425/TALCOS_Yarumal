import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/monitoring.module.css";

function MonitoringView() {
  return (
    <ProtectedRoute>
      <section className={Style.monitoring}></section>
    </ProtectedRoute>
  );
}

export default MonitoringView;
