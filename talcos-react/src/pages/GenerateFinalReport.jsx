import GenerateFinalReportForm from "../components/GenerateFinalReportForm";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/generate-final-report.module.css";

function GenerateFinalReport() {
  return (
    <ProtectedRoute>
      <section className={Style.generateFinalReport}>
        <GenerateFinalReportForm />
      </section>
    </ProtectedRoute>
  );
}

export default GenerateFinalReport;
