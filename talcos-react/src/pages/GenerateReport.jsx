import GenerateReportList from "../components/GenerateReportList";
import GenerateReportShift from "../components/GenerateReportShift";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/generate-report.module.css";

function GenerateReport() {
  return (
    <ProtectedRoute>
      <section className={Style.generateReport}>
        <header className={Style.generateReportStatus}>
          <GenerateReportShift />
        </header>
        <main className={Style.generateReportList}>
          <GenerateReportList />
        </main>
      </section>
    </ProtectedRoute>
  );
}

export default GenerateReport;
