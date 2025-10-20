import GenerateInitialReportForm from "../components/GenerateInitialReportForm";
import ProtectedRoute from "../utils/ProtectedRoute";

import Style from "./styles/generate-initial-report.module.css";

function GenerateInitialReport() {
  return (
    <ProtectedRoute>
      <section className={Style.generateInitialReport}>
        <GenerateInitialReportForm />
      </section>
    </ProtectedRoute>
  );
}

export default GenerateInitialReport;
