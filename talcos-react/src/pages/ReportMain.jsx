import ReportList from "../components/ReportList";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/report.module.css";

function ReportMain() {
  return (
    <ProtectedRoute>
      <section className={Style.report}>
        <ReportList />
      </section>
    </ProtectedRoute>
  );
}

export default ReportMain;
