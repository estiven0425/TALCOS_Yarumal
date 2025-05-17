import ReportDeleteConfirmation from "../components/ReportDeleteConfirmation";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/report-delete.module.css";

function ReportDelete() {
  return (
    <ProtectedRoute>
      <section className={Style.reportDelete}>
        <ReportDeleteConfirmation />
      </section>
    </ProtectedRoute>
  );
}

export default ReportDelete;
