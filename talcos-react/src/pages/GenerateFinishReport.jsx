import GenerateFinishReportForm from "../components/GenerateFinishReportForm";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/generate-final-report.module.css";

function GenerateFinishReport() {
  return (
    <ProtectedRoute>
      <section className={Style.generateFinalReport}>
        <GenerateFinishReportForm />
      </section>
    </ProtectedRoute>
  );
}

export default GenerateFinishReport;
