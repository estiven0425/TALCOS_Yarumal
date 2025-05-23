import MonitoringList from "../components/MonitoringList";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/monitoring.module.css";

function Monitoring() {
  return (
    <ProtectedRoute>
      <section className={Style.monitoring}>
        <MonitoringList />
      </section>
    </ProtectedRoute>
  );
}

export default Monitoring;
